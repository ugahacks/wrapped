import csv
import re


def parseGithubs(filename: str) -> list:
    """
    Takes in a DevPost Projects CSV export and returns a list of GitHub links for each project.

    Args:
        filename: The name of the CSV file

    Returns:
        list[str]: A list of GitHub links
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
            filteredLinks.append(
                f"https://github.com/{match.group(1)}/{match.group(2)}"
            )

    return filteredLinks


print(parseGithubs("projects.csv"))
