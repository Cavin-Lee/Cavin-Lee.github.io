"""Smoke tests for the local editor using an isolated copy of the site."""

import copy
import json
import shutil
import tempfile
import threading
import unittest
import urllib.request
from http.server import ThreadingHTTPServer
from pathlib import Path

import site_manager as manager


class ManagerTests(unittest.TestCase):
    def setUp(self):
        self.original_root = manager.ROOT
        self.original_data_path = manager.DATA_PATH
        self.temp = tempfile.TemporaryDirectory()
        root = Path(self.temp.name)
        for name in ("data.js", "index.html", "cn/index.html", "cv-builder/index.html", "assets/profile.jpeg"):
            target = root / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(self.original_root / name, target)
        manager.ROOT = root
        manager.DATA_PATH = root / "data.js"

    def tearDown(self):
        manager.ROOT = self.original_root
        manager.DATA_PATH = self.original_data_path
        self.temp.cleanup()

    def test_education_save_updates_index_cv_and_revision(self):
        _, revision = manager.read_data()
        result = manager.mutate_record({
            "revision": revision,
            "category": "education",
            "action": "create",
            "record": {"years": "2026–2027", "degree": {"zh": "访问学者", "en": "Visiting Scholar"}, "school": {"zh": "测试大学", "en": "Example University"}},
            "note": "本地测试",
        })
        self.assertNotEqual(revision, result["revision"])
        self.assertIn("测试大学", (manager.ROOT / "CONTENT_INDEX.md").read_text())
        self.assertIn("本地测试", (manager.ROOT / "CONTENT_CHANGELOG.md").read_text())
        for language in ("zh", "en"):
            path = manager.ROOT / f"assets/cv-{language}.pdf"
            manager.validate_pdf(path)
            reader = manager.PdfReader(str(path))
            self.assertTrue(any(image.name for image in reader.pages[0].images))

    def test_profile_titles_follow_paper_categories(self):
        data, _ = manager.read_data()
        profile = manager.profile_from_pages()
        manager.validate_profile(profile, data)
        rendered = manager.render_profile_html((manager.ROOT / "cn/index.html").read_text(), profile, "zh", list(data["areas"]))
        self.assertEqual(rendered.count('class="topic-card"'), 5)
        self.assertIn('href="#papers-brain"', rendered)
        wrong = copy.deepcopy(profile)
        wrong["topics"][0]["title"]["zh"] = "不匹配的方向"
        with self.assertRaises(manager.ManagerError):
            manager.validate_profile(wrong, data)

    def test_new_publication_updates_missing_reports(self):
        data, revision = manager.read_data()
        record = {
            "title": "Example newly indexed study",
            "year": 2026,
            "citation": "Example author. Example journal, 2026",
            "area": "brain",
            "scholar": "https://scholar.google.com/citations?user=XEfV8mkAAAAJ&citation_for_view=XEfV8mkAAAAJ:TEST_ONLY",
        }
        manager.mutate_record({"revision": revision, "category": "publications", "action": "create", "record": record})
        self.assertEqual(len(manager.read_data()[0]["publications"]), len(data["publications"]) + 1)
        self.assertIn(record["title"], (manager.ROOT / "missing-papers.md").read_text())
        manager.validate_pdf(manager.ROOT / "assets/missing-papers.pdf")
        self.assertTrue((manager.ROOT / "assets/missing-papers.xlsx").is_file())

    def test_upload_is_linked_to_edited_publication(self):
        source = manager.ROOT / "sample.pdf"
        manager.write_pdf(source, "en", "Example paper", [("Abstract", ["Test upload and association."])])
        class QuietHandler(manager.Handler):
            def log_message(self, *args):
                pass
        server = ThreadingHTTPServer(("127.0.0.1", 0), QuietHandler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        try:
            request = urllib.request.Request(
                f"http://127.0.0.1:{server.server_port}/api/upload",
                data=source.read_bytes(),
                headers={"X-Manager-Token": manager.TOKEN, "X-Record-Category": "publications", "X-Record-Title": "Example paper", "X-File-Name": "example.pdf"},
                method="POST",
            )
            uploaded = json.load(urllib.request.urlopen(request))["path"]
        finally:
            server.shutdown()
            server.server_close()
            thread.join()
        self.assertNotIn(uploaded, manager.referenced_pdfs(manager.read_data()[0]))
        data, revision = manager.read_data()
        record = dict(data["publications"][0], file=uploaded)
        manager.mutate_record({"revision": revision, "category": "publications", "action": "update", "index": 0, "record": record})
        self.assertIn(uploaded, manager.referenced_pdfs(manager.read_data()[0]))


if __name__ == "__main__":
    unittest.main()
