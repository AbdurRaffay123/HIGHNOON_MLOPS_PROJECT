import pandas as pd
from prophet import Prophet
import matplotlib.pyplot as plt
import seaborn as sns
import os

# Set up seaborn for better plots
sns.set(style="whitegrid", palette="muted", font_scale=1.2)

# Define required columns and their types
required_columns = {
    'season': 'object',
    'Year': 'float64',
    'Month': 'float64',
    'SSalD_Dist_Code': 'int64',
    'SSalD_Cust_ID': 'float64',
    'Prd_SAP_Code': 'int64',
    'Total_Quantity': 'float64',
    'Total_Value': 'float64',
    'Total_Bonus': 'float64',
    'Total_Discount': 'float64',
    'Total_DP': 'float64',
    'Total_TP': 'float64',
    'Total_MRP': 'float64'
}

def process_file(file_path):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(file_path)
    
    # Check if columns match the required columns
    missing_cols = set(required_columns.keys()) - set(df.columns)
    if missing_cols:
        raise ValueError(f"Missing columns: {', '.join(missing_cols)}")

    for col, dtype in required_columns.items():
        if df[col].dtype != dtype:
            raise ValueError(f"Column '{col}' does not have the correct dtype. Expected {dtype}, got {df[col].dtype}")

    # Preprocessing
    df['Year'] = df['Year'].astype(int)
    df['Month'] = df['Month'].astype(int)
    df['Date'] = pd.to_datetime(df['Year'].astype(str) + '-' + df['Month'].astype(str) + '-01', format='%Y-%m-%d')
    df.set_index('Date', inplace=True)

    # Prepare data for Prophet
    prophet_df = df.reset_index()[['Date', 'Total_Quantity']]
    prophet_df.columns = ['ds', 'y']

    # Remove duplicate dates if they exist
    prophet_df = prophet_df.drop_duplicates(subset=['ds'])

    # Add cap and floor to prevent negative forecasts
    prophet_df['cap'] = df['Total_Quantity'].max()  # Upper bound cap
    prophet_df['floor'] = 0  # Lower bound

    # Fit the Prophet model with logistic growth
    prophet_model = Prophet(growth='logistic')
    prophet_model.fit(prophet_df)

    # Forecast the next 1 year (12 months)
    future = prophet_model.make_future_dataframe(periods=29, freq='M')
    future['cap'] = df['Total_Quantity'].max()  # Apply the same cap to future
    future['floor'] = 0  # Apply the same floor to future
    forecast = prophet_model.predict(future)

    # Combine the forecast with actual values
    forecast_full = forecast[['ds', 'yhat']].copy()
    forecast_full = forecast_full.rename(columns={'yhat': 'Forecasted_Quantity'})
    forecast_full = forecast_full.merge(prophet_df, on='ds', how='left')
    forecast_full = forecast_full.rename(columns={'y': 'Actual_Quantity'})
    
    # Ensure the directory for saving images exists
    images_dir = './Saved_images/'
    if not os.path.exists(images_dir):
        os.makedirs(images_dir)

    # Save the forecast line plot
    plot_path = f"{images_dir}forecast_{os.path.basename(file_path).split('.')[0]}.png"
    plt.figure(figsize=(12, 6))
    sns.lineplot(data=prophet_df, x='ds', y='y', label='Historical Data', color='blue', marker='o', linewidth=2)
    sns.lineplot(data=forecast, x='ds', y='yhat', label='Prophet Forecast', color='red', linestyle='--', marker='x', linewidth=2)
    plt.title('Actual vs Forecasted Total Quantity', fontsize=16)
    plt.xlabel('Date', fontsize=12)
    plt.ylabel('Total Quantity', fontsize=12)
    plt.legend(loc='upper left', fontsize=12)
    plt.xticks(rotation=45)
    plt.grid(True, which='both', linestyle='--', linewidth=0.7)
    plt.tight_layout()
    plt.savefig(plot_path)
    plt.close()

    # Pie Chart for Forecasted Total Quantity by Year
    forecast_full['Year'] = pd.to_datetime(forecast_full['ds']).dt.year
    forecast_per_year = forecast_full.groupby('Year')['Forecasted_Quantity'].sum()

    # Plot a single pie chart for forecasted data by year
    pie_chart_path = f"{images_dir}forecast_pie_chart_{os.path.basename(file_path).split('.')[0]}.png"
    plt.figure(figsize=(8, 8))
    plt.pie(forecast_per_year, labels=forecast_per_year.index, autopct='%1.1f%%', startangle=90, colors=sns.color_palette('pastel'))
    plt.title('Forecasted Total Quantity Proportion by Year', fontsize=16)
    plt.tight_layout()
    plt.savefig(pie_chart_path)
    plt.close()

    # Bar Chart for Forecasted Total Quantity by Year
    bar_chart_path = f"{images_dir}forecast_bar_chart_{os.path.basename(file_path).split('.')[0]}.png"
    plt.figure(figsize=(10, 6))
    sns.barplot(x=forecast_per_year.index, y=forecast_per_year.values, palette="viridis")
    plt.title('Total Forecasted Quantity by Year', fontsize=16)
    plt.xlabel('Year', fontsize=12)
    plt.ylabel('Total Forecasted Quantity', fontsize=12)
    plt.xticks(rotation=45)
    plt.grid(True, which='both', linestyle='--', linewidth=0.7)
    plt.tight_layout()
    plt.savefig(bar_chart_path)
    plt.close()

    # Return paths for all generated images
    return {
        'forecast_plot': plot_path,
        'pie_chart': pie_chart_path,
        'bar_chart': bar_chart_path
    }