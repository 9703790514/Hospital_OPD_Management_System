# Git Repository Setup Guide

## 📝 Steps to Create and Push to GitHub

### 1. Create Repository on GitHub

1. Go to https://github.com/new
2. **Repository name:** `hospital-opd-management-system`
3. **Description:** "Comprehensive OPD Management System for Sarvotham's Spine Care - Built with React & Spring Boot Microservices"
4. **Visibility:** Choose Public or Private
5. ✅ **Do NOT** initialize with README, .gitignore, or license (we already have them)
6. Click **"Create repository"**

### 2. Initialize Git in Your Project

Open PowerShell in `d:\Capstone` and run:

```powershell
# Initialize Git repository
git init

# Add all files to staging
git add .

# Create first commit
git commit -m "Initial commit: Hospital OPD Management System with security improvements"
```

### 3. Connect to GitHub and Push

Replace `YOUR-USERNAME` with your actual GitHub username:

```powershell
# Add remote repository
git remote add origin https://github.com/YOUR-USERNAME/hospital-opd-management-system.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### 4. Verify Upload

Go to your GitHub repository URL:
```
https://github.com/YOUR-USERNAME/hospital-opd-management-system
```

You should see all your files uploaded! 🎉

---

## 🔑 Using Personal Access Token (Recommended)

If you get authentication errors, use a Personal Access Token:

### Generate Token:
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "OPD Management System"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### Use Token for Authentication:
```powershell
# When prompted for password, paste your token instead
git push -u origin main
```

Or configure Git to remember credentials:
```powershell
git config credential.helper store
```

---

## 📦 Alternative: Using SSH

### Setup SSH Key:

```powershell
# Generate SSH key (press Enter for all prompts)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key
Get-Content ~/.ssh/id_ed25519.pub | Set-Clipboard
```

### Add to GitHub:
1. Go to GitHub Settings → SSH and GPG keys
2. Click "New SSH key"
3. Paste your public key
4. Save

### Use SSH URL:
```powershell
git remote set-url origin git@github.com:YOUR-USERNAME/hospital-opd-management-system.git
git push -u origin main
```

---

## 🔄 Daily Git Workflow

### Making Changes:

```powershell
# Check status
git status

# Add specific files
git add frontend/src/Components/LoginPage.jsx

# Or add all changes
git add .

# Commit with meaningful message
git commit -m "feat: add input validation to login form"

# Push to GitHub
git push
```

### Common Commit Message Prefixes:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

---

## 🌿 Branching Strategy

### Create Feature Branch:
```powershell
# Create and switch to new branch
git checkout -b feature/appointment-notifications

# Make your changes...

# Commit changes
git add .
git commit -m "feat: add email notifications for appointments"

# Push branch to GitHub
git push -u origin feature/appointment-notifications
```

### Merge to Main:
```powershell
# Switch to main branch
git checkout main

# Merge feature branch
git merge feature/appointment-notifications

# Push to GitHub
git push
```

---

## 🚨 Important Notes

### Files Already Ignored (.gitignore):
- ✅ `.env` files (contains secrets)
- ✅ `node_modules/` (frontend dependencies)
- ✅ `target/` folders (backend build files)
- ✅ IDE configuration files
- ✅ Log files
- ✅ Upload folders

### Before Pushing:
1. ✅ Verify `.env` files are NOT being committed
2. ✅ Remove any sensitive data from code
3. ✅ Check `.gitignore` is working: `git status`

### Verify Sensitive Files are Ignored:
```powershell
# This should show no .env files
git status | Select-String ".env"

# This should show .env.example files only
Get-ChildItem -Recurse -Filter "*.env*"
```

---

## 📊 Repository Statistics

Once pushed, your repo will contain:
- **Frontend:** React application with Material-UI
- **Backend:** 13+ Spring Boot microservices
- **Documentation:** Architecture diagrams, API docs
- **Configuration:** Environment templates
- **Security:** JWT implementation, BCrypt hashing

---

## 🎯 Next Steps After Pushing

1. **Add Repository Description** on GitHub
2. **Add Topics/Tags:** `java`, `spring-boot`, `react`, `mongodb`, `healthcare`, `hospital-management`, `microservices`, `jwt`, `opd`
3. **Enable GitHub Actions** for CI/CD (optional)
4. **Add Collaborators** if working in a team
5. **Create Issues** for future tasks
6. **Set up Branch Protection** for main branch

---

## 🔍 Troubleshooting

### Error: "remote origin already exists"
```powershell
git remote remove origin
git remote add origin https://github.com/YOUR-USERNAME/hospital-opd-management-system.git
```

### Error: "Permission denied"
- Use Personal Access Token instead of password
- Or set up SSH authentication

### Error: "Updates were rejected"
```powershell
git pull origin main --rebase
git push origin main
```

### Undo Last Commit (Not Pushed):
```powershell
git reset --soft HEAD~1
```

### View Commit History:
```powershell
git log --oneline
```

---

## 📞 Support

If you encounter any issues:
1. Check `.gitignore` is working
2. Verify your GitHub credentials
3. Ensure you have internet connection
4. Check GitHub repository permissions

---

**Happy Coding! 🚀**
