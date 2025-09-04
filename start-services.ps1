# Allow scripts for this session
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass

# Activate virtual environment
& .\venv\Scripts\Activate.ps1

# Run services in new windows
Start-Process powershell -ArgumentList "cd backend/book_service; py manage.py runserver 8001"
Start-Process powershell -ArgumentList "cd backend/borrow_service; py manage.py runserver 8002"
Start-Process powershell -ArgumentList "cd backend/user_service; py manage.py runserver 8003"

# Start frontend
Start-Process powershell -ArgumentList "cd frontend; yarn start"


#.\start-services.ps1

