from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from model.product_wise import process_file

app = FastAPI()

# CORS Middleware to allow requests from React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files from the 'Saved_images' directory
app.mount("/Saved_images", StaticFiles(directory="Saved_images"), name="Saved_images")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Backend World!"}

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    try:
        file_location = f"uploads/{file.filename}"
        os.makedirs(os.path.dirname(file_location), exist_ok=True)
        with open(file_location, "wb") as f:
            f.write(await file.read())

        # Process the file and generate forecasts
        forecast_paths = process_file(file_location)
        
        # Construct URLs for the generated plots
        forecast_plot_url = f"/Saved_images/{os.path.basename(forecast_paths['forecast_plot'])}"
        pie_chart_url = f"/Saved_images/{os.path.basename(forecast_paths['pie_chart'])}"
        bar_chart_url = f"/Saved_images/{os.path.basename(forecast_paths['bar_chart'])}"

        return {
            "forecast_plot": forecast_plot_url,
            "pie_chart": pie_chart_url,
            "bar_chart": bar_chart_url
        }
    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}