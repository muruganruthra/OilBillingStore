from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["oil_billing"]

products_collection = db["products"]
bills_collection = db["bills"]

{
  "customerName": "John",
  "paymentType": "credit"
}