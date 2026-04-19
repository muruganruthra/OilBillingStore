from fastapi import FastAPI
from database import products_collection, bills_collection

app = FastAPI()

# ADD PRODUCT
@app.post("/add-product")
def add_product(product: dict):
    products_collection.insert_one(product)
    return {"message": "Product added"}

# GET PRODUCTS
@app.get("/products")
def get_products():
    products = list(products_collection.find({}, {"_id": 0}))
    return products

# CREATE BILL
@app.post("/create-bill")
def create_bill(data: dict):
    bills_collection.insert_one(data)
    return {"message": "Bill created"}