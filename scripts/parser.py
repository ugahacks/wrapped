"""
This script takes in a DevPost Projects CSV export and returns interesting data to be
used for UGAHacks Wrapped!

Author: Stephen D. Sulimani, 2026
"""

import csv
import re

from github import GitHub


def parseGithubs(filename: str) -> list:
    """
    Takes in a DevPost Projects CSV export and returns a list of GitHub links for each project.

    Args:
        filename: The name of the CSV file

    Returns:
        list[tuple[str, str]]: A list of GitHub links
    """
    GITHUB_REGEX = r"(?:https?:\/\/)?(?:www\.)?github\.com\/([^,\s]+)\/([^,\s.]+)"

    tryItLinks = []

    with open(filename, "r") as f:
        reader = csv.reader(f)
        tryIt_idx = -1
        for i, row in enumerate(reader):
            if i == 0:
                for j in range(len(row)):
                    if row[j] == '"Try it out" Links':
                        tryIt_idx = j
                        break
                continue
            tryItLinks.append(row[tryIt_idx])

    filteredLinks = []

    for link in tryItLinks:
        match = re.search(GITHUB_REGEX, link)
        if match:
            filteredLinks.append((match.group(1), match.group(2)))

    return filteredLinks


class Pipeline:
    def __init__(self, filename: str):
        self.repos = [GitHub(repo[0], repo[1]) for repo in parseGithubs(filename)]
        print(self.getLanguageData())
        results, repos = self.getOopsies()
        print(results)
        print(repos)

    def getLanguageData(self):
        languages = {}
        for repo in self.repos:
            languageData = repo.languages()
            for language in languageData:
                languages[language] = (
                    languages.get(language, 0) + languageData[language]
                )

        for k, v in languages.items():
            languages[k] = v / 1e3

        return languages

    def getOopsies(self) -> tuple[dict, dict]:
        query = ["node_modules", ".env", "venv"]
        results = {key: 0 for key in query}
        repos = {key: [] for key in query}
        for repo in self.repos:
            data = repo.searchFiles(query)
            for key in data:
                if data[key]:
                    results[key] += 1
                    repos[key].append(f"{repo.username}/{repo.repo}")

        return results, repos


Pipeline("projects.csv")
