import os
import requests
from dotenv import load_dotenv

load_dotenv()

GITHUB_KEY = os.environ["GITHUB_KEY"]


class GitHub:
    def __init__(self, username: str, repo: str):
        self.session = requests.session()
        self.session.headers["Authorization"] = f"Bearer {GITHUB_KEY}"
        self.username = username
        self.repo = repo
        self.baseURL = f"https://api.github.com/repos/{username}/{repo}"

    def languages(self) -> dict:
        return self.session.get(f"{self.baseURL}/languages").json()

    def searchFiles(self, query: list[str]) -> dict:
        searchResults = {key: False for key in query}
        branches = ["main", "master"]

        for branch in branches:
            response = self.session.get(
                f"{self.baseURL}/git/trees/{branch}?recursive=3"
            )

            if response.status_code == 404:
                continue

            data = response.json()

            for item in data["tree"]:
                for key in query:
                    filename = item["path"]
                    if "/" in filename:
                        filename = filename.split("/")[-1]
                    if key == filename:
                        searchResults[key] = True
                        query.remove(key)

                if len(query) == 0:
                    break

        return searchResults
