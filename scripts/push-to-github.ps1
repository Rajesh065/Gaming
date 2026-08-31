param(
    [Parameter(Mandatory=$false)]
    [string]$RepoUrl
)

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   🎮 NexusPlay - Push Project to GitHub Remote" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

if (-not $RepoUrl) {
    $RepoUrl = Read-Host "Enter your GitHub Repository URL (e.g. https://github.com/username/gaming-platform.git)"
}

if (-not $RepoUrl) {
    Write-Host "❌ No repository URL provided. Aborting." -ForegroundColor Red
    exit 1
}

Write-Host "`n[1/3] Checking Git Status..." -ForegroundColor Green
git status

Write-Host "`n[2/3] Setting Remote Origin to: $RepoUrl" -ForegroundColor Green
git remote remove origin 2>$null
git remote add origin $RepoUrl
git branch -M main

Write-Host "`n[3/3] Pushing to GitHub (main branch with closed PR merge history)..." -ForegroundColor Green
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✨ Successfully pushed NexusPlay to GitHub with all PR history!" -ForegroundColor Green
    Write-Host "Visit your repository: $RepoUrl" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️ Git push encountered an issue. Ensure you are authenticated with GitHub CLI (gh auth login) or have configured your SSH/Personal Access Token." -ForegroundColor Yellow
}
