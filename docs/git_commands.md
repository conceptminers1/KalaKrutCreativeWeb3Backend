# Git Command Reference

This document outlines the Git commands used to push the current project state to a new `production` branch on GitHub.

-   **`git init`**
    -   **Meaning:** Initializes a new, empty Git repository in the current directory. This is the first step to start tracking a new project.

-   **`git add .`**
    -   **Meaning:** Stages all new and modified files in the current directory for the next commit. The `.` represents the current directory.

-   **`git commit -m "Finalizing feature and preparing for production"`**
    -   **Meaning:** Records the staged changes to the local repository. The `-m` flag allows for an inline commit message.

-   **`git branch -M production`**
    -   **Meaning:** Renames the current branch to `production`. The `-M` flag will force the rename, even if a branch with that name already exists.

-   **`git remote add origin <URL>`**
    -   **Meaning:** Connects the local repository to a remote repository on GitHub. `origin` is the conventional name for the primary remote repository.

-   **`git push --force origin production`**
    -   **Meaning:** Pushes the local `production` branch to the `origin` remote repository. The `--force` flag is used to forcefully overwrite the remote branch with the local branch, ensuring a clean and exact copy. This is useful when establishing a new, clean production branch.
