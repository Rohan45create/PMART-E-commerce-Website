import mysql.connector
import requests

# New API Endpoints with full product details
API_ENDPOINTS = {
    "watches": "https://dummyjson.com/products/category/watches",
    "accessories": "https://dummyjson.com/products/category/mens-watches"
}

# Function to fetch products from API
def fetch_products():
    all_products = []
    
    for category, url in API_ENDPOINTS.items():
        print(f"Fetching {category} products...")
        try:
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()

            products = data.get("products", [])  # Extract product list
            
            if len(products) < 10:
                print(f"Warning: {category} has only {len(products)} items.")

            for product in products[:10]:  # Fetch at least 10 products
                formatted_product = {
                    "product_name": product.get("title", "Unknown Product"),
                    "product_description": product.get("description", "No description available"),
                    "product_category": category,
                    "product_brand": product.get("brand", "No Brand"),
                    "selling_price": float(product.get("price", 0.0)),
                    "actual_price": float(product.get("price", 0.0)) * (1 + (product.get("discountPercentage", 0) / 100)),
                    "quantity": int(product.get("stock", 10)),
                    "product_image": product.get("thumbnail", product.get("images", [""])[0])
                }
                all_products.append(formatted_product)

            print(f"Fetched {len(products[:10])} {category} products.")
        except Exception as e:
            print(f"Error fetching {category}: {str(e)}")

    return all_products

# Function to insert data into MySQL
def insert_products(products):
    try:
        db = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="pmart"
        )
        cursor = db.cursor()

        sql = """
            INSERT INTO products (
                product_name, product_description, product_category, product_brand,
                selling_price, actual_price, quantity, product_image
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        values = [(p["product_name"], p["product_description"], p["product_category"], 
                   p["product_brand"], p["selling_price"], p["actual_price"], 
                   p["quantity"], p["product_image"]) for p in products]

        if values:
            cursor.executemany(sql, values)
            db.commit()
            print(f"Inserted {cursor.rowcount} records successfully!")
    except mysql.connector.Error as e:
        print(f"MySQL Error: {str(e)}")
    except Exception as e:
        print(f"General Error: {str(e)}")
    finally:
        cursor.close()
        db.close()

# Main execution
if __name__ == "__main__":
    products = fetch_products()
    if products:
        insert_products(products)
    else:
        print("No products fetched.")
