# Add Product Categories to Manufacturer Service

## TODO List

- [x] Create ProductCategory entity with id, name, description, and timestamps
- [x] Add @ManyToOne relationship from Product to ProductCategory (optional, nullable)
- [x] Create CategoryRequest DTO
- [x] Create CategoryResponse DTO
- [x] Create CategoryRepository interface
- [x] Create CategoryService interface
- [x] Create CategoryServiceImpl class
- [x] Create CategoryController for category CRUD operations
- [x] Update ProductRequest to include categoryId (Long)
- [x] Update ProductResponse to include category details (nested object)
- [x] Add category-related queries to ProductRepository (e.g., find by category)
- [x] Update ProductService interface to handle category in create/update operations
- [x] Update ProductServiceImpl to handle category in create/update operations
- [x] Update ProductController to accept categoryId in requests and include category in responses
- [x] Test category assignment and retrieval
