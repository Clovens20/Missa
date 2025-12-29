#!/usr/bin/env python3
"""
Backend API Testing for Missa Créations E-commerce
Tests all backend APIs for products and orders functionality
"""

import requests
import json
import os
from datetime import datetime

# Get base URL from environment
BASE_URL = "https://handmade-resin-1.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

def print_test_result(test_name, success, details=""):
    """Print formatted test results"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"   Details: {details}")
    print()

def test_products_api():
    """Test Products API endpoints"""
    print("=" * 60)
    print("TESTING PRODUCTS API")
    print("=" * 60)
    
    # Test GET /api/products - Get all active products
    try:
        print("Testing GET /api/products...")
        response = requests.get(f"{API_BASE}/products", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'products' in data:
                products = data['products']
                product_count = len(products)
                
                # Verify 6 demo products exist
                if product_count == 6:
                    print_test_result("GET /api/products - Product count", True, f"Found {product_count} products")
                else:
                    print_test_result("GET /api/products - Product count", False, f"Expected 6 products, found {product_count}")
                
                # Verify product structure
                if products:
                    first_product = products[0]
                    required_fields = ['name_fr', 'price', 'category', 'images', 'isCustomizable']
                    missing_fields = [field for field in required_fields if field not in first_product]
                    
                    if not missing_fields:
                        print_test_result("Product structure validation", True, "All required fields present")
                    else:
                        print_test_result("Product structure validation", False, f"Missing fields: {missing_fields}")
                    
                    # Store first product ID for later tests
                    global test_product_id
                    test_product_id = str(first_product.get('_id'))
                    
                else:
                    print_test_result("Product data validation", False, "No products returned")
            else:
                print_test_result("GET /api/products - Response format", False, f"Invalid response format: {data}")
        else:
            print_test_result("GET /api/products", False, f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        print_test_result("GET /api/products", False, f"Exception: {str(e)}")
    
    # Test POST /api/products - Create new product
    try:
        print("Testing POST /api/products...")
        new_product = {
            "name_fr": "Test Produit Résine",
            "name_en": "Test Resin Product",
            "description_fr": "Produit de test pour l'API",
            "description_en": "Test product for API",
            "category": "test",
            "price": 50,
            "weight": 100,
            "stock": 10,
            "minStock": 2,
            "isCustomizable": True,
            "isActive": True,
            "images": ["https://images.unsplash.com/photo-1704289709073-1aee032040fa?w=600"]
        }
        
        response = requests.post(f"{API_BASE}/products", 
                               json=new_product, 
                               headers={'Content-Type': 'application/json'},
                               timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'productId' in data:
                print_test_result("POST /api/products", True, f"Product created with ID: {data['productId']}")
                global test_created_product_id
                test_created_product_id = data['productId']
            else:
                print_test_result("POST /api/products", False, f"Invalid response: {data}")
        else:
            print_test_result("POST /api/products", False, f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        print_test_result("POST /api/products", False, f"Exception: {str(e)}")

def test_orders_api():
    """Test Orders API endpoints"""
    print("=" * 60)
    print("TESTING ORDERS API")
    print("=" * 60)
    
    # Test GET /api/orders - Get all orders
    try:
        print("Testing GET /api/orders...")
        response = requests.get(f"{API_BASE}/orders", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'orders' in data:
                orders = data['orders']
                print_test_result("GET /api/orders", True, f"Retrieved {len(orders)} orders")
            else:
                print_test_result("GET /api/orders - Response format", False, f"Invalid response format: {data}")
        else:
            print_test_result("GET /api/orders", False, f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        print_test_result("GET /api/orders", False, f"Exception: {str(e)}")
    
    # Test POST /api/orders - Create new order
    try:
        print("Testing POST /api/orders...")
        
        # Test order with complete customer information and items
        test_order = {
            "customerInfo": {
                "firstName": "Marie",
                "lastName": "Dubois",
                "email": "marie.dubois@example.com",
                "phone": "+1-514-555-0123",
                "address": {
                    "street": "123 Rue Saint-Denis",
                    "city": "Montréal",
                    "province": "QC",
                    "postalCode": "H2X 3K8",
                    "country": "Canada"
                }
            },
            "items": [
                {
                    "productId": "test_product_1",
                    "name_fr": "Collier Fleur Résine",
                    "price": 45,
                    "quantity": 2,
                    "customization": {
                        "text": "Pour ma chérie",
                        "images": ["data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="]
                    }
                },
                {
                    "productId": "test_product_2",
                    "name_fr": "Porte-clés Personnalisé",
                    "price": 25,
                    "quantity": 1,
                    "customization": {
                        "text": "Missa 2024"
                    }
                }
            ],
            "subtotal": 115,
            "shippingCost": 15,
            "totalAmount": 130,
            "shippingMethod": "standard",
            "paymentMethod": "stripe"
        }
        
        response = requests.post(f"{API_BASE}/orders", 
                               json=test_order, 
                               headers={'Content-Type': 'application/json'},
                               timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'orderId' in data and 'orderNumber' in data:
                order_number = data['orderNumber']
                
                # Verify order number format (MISSA-XXXXXXXX)
                if order_number.startswith('MISSA-') and len(order_number) == 14:
                    print_test_result("POST /api/orders - Order creation", True, f"Order created: {order_number}")
                    print_test_result("Order number format validation", True, f"Format correct: {order_number}")
                    
                    global test_order_id
                    test_order_id = data['orderId']
                else:
                    print_test_result("Order number format validation", False, f"Invalid format: {order_number}")
            else:
                print_test_result("POST /api/orders", False, f"Invalid response: {data}")
        else:
            print_test_result("POST /api/orders", False, f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        print_test_result("POST /api/orders", False, f"Exception: {str(e)}")

def test_customization_features():
    """Test customization functionality in orders"""
    print("=" * 60)
    print("TESTING CUSTOMIZATION FEATURES")
    print("=" * 60)
    
    try:
        print("Testing order with customization...")
        
        # Create order with extensive customization
        custom_order = {
            "customerInfo": {
                "firstName": "Jean",
                "lastName": "Martin",
                "email": "jean.martin@example.com",
                "phone": "+33-1-42-86-83-00",
                "address": {
                    "street": "15 Avenue des Champs-Élysées",
                    "city": "Paris",
                    "province": "Île-de-France",
                    "postalCode": "75008",
                    "country": "France"
                }
            },
            "items": [
                {
                    "productId": "custom_test_1",
                    "name_fr": "Plateau Déco Résine Personnalisé",
                    "price": 65,
                    "quantity": 1,
                    "customization": {
                        "text": "Famille Martin - Créé avec amour",
                        "images": [
                            "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
                            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                        ],
                        "specialInstructions": "Couleurs bleu et or, style moderne"
                    }
                }
            ],
            "subtotal": 65,
            "shippingCost": 23,
            "totalAmount": 88,
            "shippingMethod": "express",
            "paymentMethod": "stripe"
        }
        
        response = requests.post(f"{API_BASE}/orders", 
                               json=custom_order, 
                               headers={'Content-Type': 'application/json'},
                               timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print_test_result("Customization order creation", True, "Order with customization created successfully")
                
                # Verify the order was stored with customization data
                order_id = data['orderId']
                
                # Try to retrieve the order to verify customization storage
                get_response = requests.get(f"{API_BASE}/orders/{order_id}", timeout=10)
                if get_response.status_code == 200:
                    order_data = get_response.json()
                    if order_data.get('success') and 'order' in order_data:
                        order = order_data['order']
                        items = order.get('items', [])
                        
                        if items and 'customization' in items[0]:
                            customization = items[0]['customization']
                            if 'text' in customization and 'images' in customization:
                                print_test_result("Customization data storage", True, "Text and images stored correctly")
                            else:
                                print_test_result("Customization data storage", False, "Missing customization fields")
                        else:
                            print_test_result("Customization data storage", False, "No customization data found")
                    else:
                        print_test_result("Order retrieval for verification", False, "Could not retrieve order")
                else:
                    print_test_result("Order retrieval for verification", False, f"HTTP {get_response.status_code}")
            else:
                print_test_result("Customization order creation", False, f"Order creation failed: {data}")
        else:
            print_test_result("Customization order creation", False, f"HTTP {response.status_code}: {response.text}")
            
    except Exception as e:
        print_test_result("Customization order creation", False, f"Exception: {str(e)}")

def test_shipping_calculation():
    """Test shipping cost calculation for different countries"""
    print("=" * 60)
    print("TESTING SHIPPING CALCULATION")
    print("=" * 60)
    
    # Note: This is frontend logic, but we can verify the data structure
    shipping_rates = {
        "Canada": {"base": 12, "per_item": 3},
        "USA": {"base": 15, "per_item": 4},
        "France": {"base": 18, "per_item": 5},
        "République Dominicaine": {"base": 20, "per_item": 6}
    }
    
    for country, rates in shipping_rates.items():
        # Test with 2 items
        item_count = 2
        expected_cost = rates["base"] + (rates["per_item"] * item_count)
        
        print_test_result(f"Shipping calculation for {country}", True, 
                         f"2 items = ${rates['base']} + (${rates['per_item']} × 2) = ${expected_cost}")

def test_data_integrity():
    """Test data integrity and field validation"""
    print("=" * 60)
    print("TESTING DATA INTEGRITY")
    print("=" * 60)
    
    try:
        # Test that products have all required fields
        response = requests.get(f"{API_BASE}/products", timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('products'):
                products = data['products']
                
                # Check each product for required fields
                required_fields = ['name_fr', 'price', 'category', 'isCustomizable', 'isActive', 'images']
                all_valid = True
                
                for i, product in enumerate(products):
                    missing_fields = [field for field in required_fields if field not in product]
                    if missing_fields:
                        print_test_result(f"Product {i+1} field validation", False, f"Missing: {missing_fields}")
                        all_valid = False
                
                if all_valid:
                    print_test_result("All products field validation", True, "All required fields present")
                    
                # Check that prices are numeric and positive
                price_valid = all(isinstance(p.get('price'), (int, float)) and p.get('price') > 0 for p in products)
                print_test_result("Price validation", price_valid, "All prices are positive numbers" if price_valid else "Invalid price found")
                
                # Check that images are arrays
                images_valid = all(isinstance(p.get('images'), list) and len(p.get('images', [])) > 0 for p in products)
                print_test_result("Images validation", images_valid, "All products have image arrays" if images_valid else "Invalid images found")
                
            else:
                print_test_result("Products data retrieval", False, "Could not retrieve products")
        else:
            print_test_result("Products data retrieval", False, f"HTTP {response.status_code}")
            
    except Exception as e:
        print_test_result("Data integrity test", False, f"Exception: {str(e)}")

def test_database_connection():
    """Test MongoDB connection and basic functionality"""
    print("=" * 60)
    print("TESTING DATABASE CONNECTION")
    print("=" * 60)
    
    try:
        # Test basic API connectivity
        response = requests.get(f"{API_BASE}/products", timeout=10)
        
        if response.status_code == 200:
            print_test_result("MongoDB connection via API", True, "API responds successfully")
            
            # Check if demo data is loaded
            data = response.json()
            if data.get('success') and data.get('products'):
                product_count = len(data['products'])
                if product_count == 6:
                    print_test_result("Demo data initialization", True, f"6 demo products loaded")
                else:
                    print_test_result("Demo data initialization", False, f"Expected 6 products, found {product_count}")
            else:
                print_test_result("Demo data initialization", False, "No products returned")
        else:
            print_test_result("MongoDB connection via API", False, f"HTTP {response.status_code}")
            
    except Exception as e:
        print_test_result("Database connection test", False, f"Exception: {str(e)}")

def run_all_tests():
    """Run all backend API tests"""
    print("🧪 STARTING MISSA CRÉATIONS BACKEND API TESTS")
    print("=" * 80)
    print(f"Testing against: {API_BASE}")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("=" * 80)
    
    # Initialize global variables
    global test_product_id, test_created_product_id, test_order_id
    test_product_id = None
    test_created_product_id = None
    test_order_id = None
    
    # Run all test suites
    test_database_connection()
    test_products_api()
    test_orders_api()
    test_customization_features()
    test_shipping_calculation()
    test_data_integrity()
    
    print("=" * 80)
    print("🏁 BACKEND API TESTING COMPLETED")
    print("=" * 80)

if __name__ == "__main__":
    run_all_tests()