# How to Submit Drive Space Monitor Applet

This guide explains how to make your Cinnamon applet available for others to use.

## Option 1: Submit to Cinnamon Spices (Recommended)

**Cinnamon Spices** is the official repository for Cinnamon applets, themes, desklets, and extensions. This is the most common way users discover and install applets.

### Steps:

1. **Create a GitHub Account** (if you don't have one)
   - Go to https://github.com and create an account

2. **Fork the Cinnamon Spices Repository**
   - Visit: https://github.com/linuxmint/cinnamon-spices-applets
   - Click "Fork" to create your own copy

3. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/cinnamon-spices-applets.git
   cd cinnamon-spices-applets
   ```

4. **Add Your Applet**
   - Create a directory: `drive-space@diskmonitor/`
   - Copy all your applet files into this directory:
     - `metadata.json`
     - `applet.js`
     - `stylesheet.css`
     - `settings-schema.json`
     - `README.md` (optional but recommended)
     - `LICENSE` (optional but recommended)

5. **Create a Screenshot**
   - Take a screenshot of your applet in action
   - Save it as `screenshot.png` in your applet directory
   - Recommended size: 400x300px or similar

6. **Commit and Push**
   ```bash
   git add drive-space@diskmonitor/
   git commit -m "Add Drive Space Monitor applet"
   git push origin main
   ```

7. **Submit a Pull Request**
   - Go to https://github.com/linuxmint/cinnamon-spices-applets
   - Click "Pull Requests" → "New Pull Request"
   - Select your fork and branch
   - Fill out the PR description explaining your applet
   - Submit the PR

8. **Wait for Review**
   - The Cinnamon team will review your submission
   - They may request changes or improvements
   - Once approved, it will be merged and available to all users

### Requirements for Cinnamon Spices:
- ✅ Your applet must have a unique UUID (you have: `drive-space@diskmonitor`)
- ✅ Include all necessary files
- ✅ Follow Cinnamon applet conventions
- ✅ Include a screenshot
- ✅ Have a clear description in metadata.json

## Option 2: Publish on GitHub/GitLab

If you want to distribute it independently or while waiting for Spices approval:

1. **Create a New Repository**
   - On GitHub/GitLab, create a new repository
   - Name it something like `cinnamon-drive-space-monitor`

2. **Initialize and Push**
   ```bash
   cd /mnt/Media4/Work/apps/cinammon/DriveSpaceMonitor
   git init
   git add .
   git commit -m "Initial commit: Drive Space Monitor applet"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/cinnamon-drive-space-monitor.git
   git push -u origin main
   ```

3. **Create a Release**
   - Go to your repository on GitHub
   - Click "Releases" → "Create a new release"
   - Tag version: `v1.0.0`
   - Upload a zip file of your applet directory

4. **Update README**
   - Add installation instructions
   - Include screenshots
   - Add a link to download the latest release

5. **Share the Link**
   - Users can download and install manually
   - Or they can clone the repository

## Option 3: Direct Distribution

For immediate sharing with friends or small groups:

1. **Create a ZIP File**
   ```bash
   cd /mnt/Media4/Work/apps/cinammon/DriveSpaceMonitor
   zip -r drive-space-monitor-v1.0.0.zip . -x "*.git*" "*.md" "config.json.example"
   ```

2. **Share the ZIP**
   - Upload to file sharing service
   - Email to users
   - Post on forums/communities

3. **Provide Installation Instructions**
   - Users extract the ZIP
   - Copy to `~/.local/share/cinnamon/applets/drive-space@diskmonitor`
   - Reload Cinnamon

## Pre-Submission Checklist

Before submitting, make sure:

- [ ] All files are present and working
- [ ] `metadata.json` has correct information
- [ ] `settings-schema.json` is complete
- [ ] Code is clean and commented (if needed)
- [ ] README.md has clear instructions
- [ ] LICENSE file is included
- [ ] Screenshot is included (for Spices)
- [ ] Tested on multiple Cinnamon versions (if possible)
- [ ] No hardcoded paths or personal information
- [ ] UUID is unique and descriptive

## Additional Resources

- **Cinnamon Spices Website**: https://cinnamon-spices.linuxmint.com/applets
- **Cinnamon Applet Documentation**: https://projects.linuxmint.com/reference/git/cinnamon/cinnamon-js/
- **Cinnamon Spices Repository**: https://github.com/linuxmint/cinnamon-spices-applets
- **Cinnamon Forums**: https://forums.linuxmint.com/

## Notes

- The UUID `drive-space@diskmonitor` should be unique. Check existing applets to ensure it's not taken.
- Consider adding an icon file (`icon.png`) to your applet directory for better visual representation.
- Keep your applet updated and responsive to user feedback.


