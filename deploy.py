import os
import subprocess
import sys

def run_command(command):
    """Run a shell command and return the result"""
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        return True, result.stdout
    except subprocess.CalledProcessError as e:
        return False, e.stderr

def deploy_to_vercel():
    """Deploy the application to Vercel"""
    print("🚀 Starting deployment to Vercel...")
    
    # Check if Vercel CLI is installed
    success, output = run_command("vercel --version")
    if not success:
        print("❌ Vercel CLI not found. Installing...")
        success, output = run_command("npm install -g vercel")
        if not success:
            print(f"❌ Failed to install Vercel CLI: {output}")
            return False
    
    # Set up environment variables
    print("🔧 Setting up environment variables...")
    env_vars = [
        f"DATABASE_URL={os.getenv('DATABASE_URL')}",
        f"SECRET_KEY={os.getenv('SECRET_KEY')}",
        "FLASK_ENV=production"
    ]
    
    for env_var in env_vars:
        key, value = env_var.split('=', 1)
        success, output = run_command(f'vercel env add {key} production <<< "{value}"')
        if success:
            print(f"✅ Set environment variable: {key}")
        else:
            print(f"⚠️  Warning: Could not set {key}: {output}")
    
    # Deploy to Vercel
    print("📦 Deploying to Vercel...")
    success, output = run_command("vercel --prod")
    if success:
        print("✅ Deployment successful!")
        print(f"🌐 Your app is live at: {output.strip()}")
        return True
    else:
        print(f"❌ Deployment failed: {output}")
        return False

if __name__ == '__main__':
    if not os.path.exists('.env'):
        print("❌ .env file not found. Please create it with your database credentials.")
        sys.exit(1)
    
    deploy_to_vercel()