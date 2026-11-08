import type { CommandEntry } from './types';

function gitDoc(command: string): string {
  return `https://git-scm.com/docs/git-${command}`;
}

export const GIT_COMMANDS: CommandEntry[] = [
  {
    command: 'git init',
    title: 'Create a repository',
    description: 'Initializes a new Git repository in the current directory.',
    example: 'git init',
    docsUrl: gitDoc('init'),
  },
  {
    command: 'git clone',
    title: 'Copy a repository',
    description: 'Downloads a repository and checks out its default branch.',
    example: 'git clone https://example.com/team/project.git',
    docsUrl: gitDoc('clone'),
  },
  {
    command: 'git status',
    title: 'Inspect the working tree',
    description: 'Shows staged, unstaged, and untracked changes.',
    example: 'git status --short --branch',
    docsUrl: gitDoc('status'),
  },
  {
    command: 'git add',
    title: 'Stage changes',
    description: 'Adds file changes to the index for the next commit.',
    example: 'git add src/components/Header.astro',
    caution:
      'Review staged files before committing. Avoid blindly using git add -A in a repository that may contain secrets or large generated files.',
    docsUrl: gitDoc('add'),
  },
  {
    command: 'git commit',
    title: 'Record a snapshot',
    description: 'Creates a commit from staged changes with a message.',
    example: 'git commit -m "Fix navigation focus styles"',
    docsUrl: gitDoc('commit'),
  },
  {
    command: 'git log',
    title: 'Read history',
    description: 'Displays commit history, authors, dates, and messages.',
    example: 'git log --oneline --graph --decorate -20',
    docsUrl: gitDoc('log'),
  },
  {
    command: 'git diff',
    title: 'Compare changes',
    description: 'Shows differences between the working tree, index, or commits.',
    example: 'git diff --stat',
    docsUrl: gitDoc('diff'),
  },
  {
    command: 'git show',
    title: 'Inspect an object',
    description: 'Displays a commit, tag, or tree with its changes and metadata.',
    example: 'git show HEAD',
    docsUrl: gitDoc('show'),
  },
  {
    command: 'git branch',
    title: 'List or manage branches',
    description: 'Lists branches or creates, renames, and deletes them.',
    example: 'git branch --list',
    docsUrl: gitDoc('branch'),
  },
  {
    command: 'git switch',
    title: 'Change branches',
    description: 'Switches to an existing branch or creates a new one with -c.',
    example: 'git switch -c feature/search',
    docsUrl: gitDoc('switch'),
  },
  {
    command: 'git restore',
    title: 'Restore working files',
    description: 'Restores files from the index or a commit, discarding current changes when targeted at the working tree.',
    example: 'git restore src/styles/global.css',
    caution:
      'This can permanently discard uncommitted work. Inspect git status and consider stashing first.',
    docsUrl: gitDoc('restore'),
  },
  {
    command: 'git checkout',
    title: 'Legacy switch and restore',
    description: 'Older command that switches branches or restores files. Prefer git switch and git restore in new workflows.',
    example: 'git checkout main',
    caution:
      'git checkout <path> can discard uncommitted changes without an obvious prompt.',
    docsUrl: gitDoc('checkout'),
  },
  {
    command: 'git merge',
    title: 'Combine histories',
    description: 'Joins another branch into the current branch, creating a merge commit when histories diverged.',
    example: 'git merge feature/search',
    docsUrl: gitDoc('merge'),
  },
  {
    command: 'git rebase',
    title: 'Replay commits',
    description: 'Reapplies commits from the current branch onto another base.',
    example: 'git rebase main',
    caution:
      'Rebasing rewrites commit hashes. Avoid rebasing commits that other people have already pulled from a shared branch.',
    docsUrl: gitDoc('rebase'),
  },
  {
    command: 'git stash',
    title: 'Shelve changes temporarily',
    description: 'Saves uncommitted changes so you can switch context, then restores them later.',
    example: 'git stash push -m "work in progress"',
    docsUrl: gitDoc('stash'),
  },
  {
    command: 'git stash pop',
    title: 'Restore shelved changes',
    description: 'Applies the most recent stash and removes it from the stash list.',
    example: 'git stash pop',
    caution:
      'A pop can conflict with newer edits. If the work is valuable, use git stash apply and keep the stash entry until you are satisfied.',
    docsUrl: gitDoc('stash'),
  },
  {
    command: 'git fetch',
    title: 'Download remote refs',
    description: 'Fetches remote branches and tags without changing the working tree.',
    example: 'git fetch --all --prune',
    docsUrl: gitDoc('fetch'),
  },
  {
    command: 'git pull',
    title: 'Fetch and integrate',
    description: 'Fetches from a remote and merges or rebases the current branch.',
    example: 'git pull --ff-only',
    caution:
      'A plain pull can create unexpected merge commits. --ff-only fails safely when the branch has diverged.',
    docsUrl: gitDoc('pull'),
  },
  {
    command: 'git push',
    title: 'Publish commits',
    description: 'Uploads local commits to a remote branch.',
    example: 'git push -u origin feature/search',
    caution:
      'Force-pushing rewrites shared history. Never force-push a main branch without explicit coordination.',
    docsUrl: gitDoc('push'),
  },
  {
    command: 'git remote',
    title: 'Manage remotes',
    description: 'Lists, adds, changes, or removes remote repository URLs.',
    example: 'git remote -v',
    docsUrl: gitDoc('remote'),
  },
  {
    command: 'git reset',
    title: 'Move the branch pointer',
    description: 'Moves HEAD and optionally changes the index or working tree to match a commit.',
    example: 'git reset --soft HEAD~1',
    caution:
      'git reset --hard discards tracked working-tree changes. Use softer modes or restore from the reflog if unsure.',
    docsUrl: gitDoc('reset'),
  },
  {
    command: 'git revert',
    title: 'Undo a commit safely',
    description: 'Creates a new commit that reverses the changes from an earlier commit.',
    example: 'git revert <commit>',
    caution:
      'Revert can conflict with later changes. It is safer than rewriting public history when the commit is already shared.',
    docsUrl: gitDoc('revert'),
  },
  {
    command: 'git reflog',
    title: 'Recover lost commits',
    description: 'Shows where HEAD and branch refs have pointed recently, including commits no longer on a branch.',
    example: 'git reflog --date=iso',
    docsUrl: gitDoc('reflog'),
  },
  {
    command: 'git tag',
    title: 'Mark a release',
    description: 'Lists, creates, or deletes tags. Annotated tags contain metadata and can be signed.',
    example: 'git tag -a v1.0.0 -m "Version 1.0.0"',
    docsUrl: gitDoc('tag'),
  },
  {
    command: 'git cherry-pick',
    title: 'Copy a commit',
    description: 'Applies the changes from a specific commit onto the current branch.',
    example: 'git cherry-pick <commit>',
    caution:
      'Cherry-picking duplicates a change under a new commit. Track where it came from to avoid merge confusion.',
    docsUrl: gitDoc('cherry-pick'),
  },
  {
    command: 'git bisect',
    title: 'Find a regression',
    description: 'Uses binary search over history to identify the commit that introduced a bug.',
    example: 'git bisect start',
    docsUrl: gitDoc('bisect'),
  },
  {
    command: 'git clean',
    title: 'Remove untracked files',
    description: 'Deletes untracked files and directories from the working tree.',
    example: 'git clean -nd',
    caution:
      'Untracked work is not recoverable through Git. Preview with -n and use -d only when you intend to remove directories.',
    docsUrl: gitDoc('clean'),
  },
  {
    command: 'git worktree',
    title: 'Work in multiple checkouts',
    description: 'Creates linked working trees so several branches can be checked out at once.',
    example: 'git worktree add ../project-hotfix hotfix',
    docsUrl: gitDoc('worktree'),
  },
  {
    command: 'git blame',
    title: 'Trace line history',
    description: 'Shows the last commit and author for each line of a file.',
    example: 'git blame -L 1,20 src/data/tools.ts',
    caution:
      'Blame identifies commits, not responsibility or blameworthiness. Use it for context, not judgment.',
    docsUrl: gitDoc('blame'),
  },
  {
    command: 'git shortlog',
    title: 'Summarize contributions',
    description: 'Groups commit history by author and subject.',
    example: 'git shortlog -sn --no-merges',
    docsUrl: gitDoc('shortlog'),
  },
  {
    command: 'git config',
    title: 'Read or set configuration',
    description: 'Views and changes Git configuration at system, global, or repository scope.',
    example: 'git config --get user.email',
    caution:
      'Use the correct scope. Changing global configuration affects every repository on the machine.',
    docsUrl: gitDoc('config'),
  },
];
