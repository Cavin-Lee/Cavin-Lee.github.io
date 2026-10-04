"""Check CV references against representative Scholar record types."""

import unittest

import site_manager
from gbt_citations import format_gbt


class GBTCitationTests(unittest.TestCase):
    def test_journal_conference_and_preprint(self):
        examples = [
            ({"title": "A study", "year": 2025, "citation": "W Li, X Xu, L Peng, X Gao. Cerebral Cortex 33 (2), 12-19, 2025"},
             "LI W, XU X, PENG L, et al. A study[J]. Cerebral Cortex, 2025, 33(2): 12-19."),
            ({"title": "A conference paper", "year": 2024, "citation": "W Li, X Chen. 2024 International Conference on AI, 10-15, 2024"},
             "LI W, CHEN X. A conference paper[C]//2024 International Conference on AI. 2024: 10-15."),
            ({"title": "A preprint", "year": 2022, "citation": "W Li, S Chen. arXiv preprint arXiv:2204.03467, 2022"},
             "LI W, CHEN S. A preprint[PP/OL]. arXiv (2022-04)[2026-10-05]. https://arxiv.org/abs/2204.03467."),
        ]
        for record, expected in examples:
            with self.subTest(record=record["title"]):
                self.assertEqual(format_gbt(record, "2026-10-05"), expected)

    def test_every_published_cv_reference_is_ready(self):
        data, _ = site_manager.read_data()
        self.assertTrue(data["publications"])
        for record in data["publications"]:
            citation = record.get("gbtCitation", "")
            with self.subTest(title=record["title"]):
                self.assertIn(". ", citation)
                self.assertRegex(citation, r"\[(J|C|PP/OL)\]")
                self.assertNotIn("…", citation)
                self.assertNotIn("收藏 2", citation)
                self.assertTrue(citation.endswith("."))


if __name__ == "__main__":
    unittest.main()
