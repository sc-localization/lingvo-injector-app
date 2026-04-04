> [!NOTE]
> Please prefer English language for all communication.

## Creating an issue

Before creating an issue please ensure that the problem is not [already reported](https://github.com/sc-localization/lingvo-injector-app/issues).

## How to Contribute

1. **Fork and Clone the Repository**

   First, create your own copy of the repository by clicking the "Fork" button on GitHub. Then, clone your fork to your local machine:

   ```sh
   git clone https://github.com/your-username/lingvo-injector-app.git
   cd lingvo-injector-app
   ```

2. **Create a New Branch**

   ```sh
   git checkout -b feature/short-description
   ```

3. **Make Changes**
   Implement your feature or fix the bug. Be sure to follow the project's coding style and add tests if necessary.

4. **Commit Changes**

   Before committing, ensure your code is clean and functional:
   - Run linting and formatting: `npm run lint` and `npm run format`
   - Build the application to check for compilation errors: `npm run tauri:build:release`
   - Run the application to verify your changes: `npm run tauri dev

   Once verified, commit your changes:

   ```sh
   git add .
   git commit -m "feat: add new super feature"
   ```

6. **Update Your Branch**

   Before pushing, make sure your branch is up to date with `main` to avoid merge conflicts:

   ```sh
   git fetch origin
   git rebase origin/main
   ```

   If there are conflicts, resolve them in your editor, then:

   ```sh
   git add .
   git rebase --continue
   ```

7. **Push Changes**

   ```sh
   git push -u origin feature/short-description
   ```

   If you've rebased a branch that was already pushed, you'll need to force-push:

   ```sh
   git push --force-with-lease origin feature/short-description
   ```

8. **Create a Pull Request**

## Commit messages

Commit messages should follow the [Conventional Commits](https://conventionalcommits.org) specification:

```
<type>[optional scope]: <description>
```

### Allowed `<type>`

- `chore`: any repository maintainance changes
- `feat`: code change that adds a new feature
- `fix`: bug fix
- `perf`: code change that improves performance
- `refactor`: code change that is neither a feature addition nor a bug fix nor a performance improvement
- `docs`: documentation only changes
- `ci`: a change made to CI configurations and scripts
- `style`: cosmetic code change
- `test`: change that only adds or corrects tests
- `revert`: change that reverts previous commits

If you have any questions or need help, feel free to open an issue or ask in the discussions section. We appreciate your contributions!
