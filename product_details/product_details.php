<?php
include './database.php';

// Get product ID from URL
$product_id = isset($_GET['product_id']) ? (int)$_GET['product_id'] : 0;

// Fetch product details
$stmt = $conn->prepare("SELECT * FROM products WHERE product_id = ?");
$stmt->bind_param("i", $product_id);
$stmt->execute();
$result = $stmt->get_result();
$product = $result->fetch_assoc();

if(!$product) {
    header("Location: ../Home Page/index.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Keep existing head content -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="./output.css" />
    <link rel="stylesheet" href="../Home Page/style.css" />
    <link rel="stylesheet" href="../Home Page/style-mediaQueries.css" />
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
        integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
        crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
    <link rel="stylesheet" href="./product_details.css">
    <title><?= htmlspecialchars($product['product_name']) ?> - PMART</title>
</head>

<body class="font-[Inter]">
    <!-- Navigation bar  -->
    <header>
        <div class="top-bar">
            <div>Rupees</div>
            <div>
                <a href="../Feedback/Feedback.html">Feedback</a>
                <a href="../FAQs/faq.html">FAQ</a>
                <a href="../About_Page/AboutUs.html">About Us</a>
                <a href="../Contact_page/Contact.html">Contact Us</a>
            </div>
        </div>
        <div class="header">
            <div class="nav-container flex-col">
                <div class="combine flex justify-between w-full">
                    <div class="logo"><span>P</span>MART</div>
                    <!-- Hamburger Menu Icon for Mobile -->

                    <div class="hamburger-menu">
                        <i class="fa-solid fa-bars" id="hamburger-icon"></i>

                        <div class="mobile-dropdown">
                            <span class="material-symbols-outlined" id="back-arrow">
                                arrow_back
                            </span>
                            <a href="../product_listing/product_listing.html">All Categories</a>
                            <a href="../Feedback/Feedback.html">Feedback</a>
                            <a href="../Contact_page/Contact.html">Contact Us</a>
                            <a href="../About_Page/AboutUs.html">About Us</a>
                            <a href="../product_listing/product_listing.html">Today's Deals</a>
                            <a href="../product_listing/product_listing.html">Special Event</a>
                            <a href="../FAQs/faq.html">FAQ's</a>
                        </div>
                    </div>
                </div>
                <div class="search search-bar2 w-full hidden">
                    <input type="text" class="search-input" placeholder="Search here" id="search-input" />
                    <i class="fas fa-search search-icon"></i>
                </div>

            </div>
            <div class="search-link">
                <div class="search search-bar">
                    <input type="text" class="search-input" placeholder="Search here" />
                    <i class="fas fa-search search-icon"></i>
                </div>
                <div class="nav-links">
                    <a href="../Home Page/index.html">Home</a>
                    <div class="dropdown-container">
                        <a href="../product_listing/product_listing.html" class="all-cat">All Category <i
                                class="fa-solid fa-chevron-down"></i></a>
                        <div class="dropdown">
                            <a href="../product_listing/product_listing.html">Electronics</a>
                            <a href="../product_listing/product_listing.html">Clothing</a>
                            <a href="../product_listing/product_listing.html">Watches</a>
                        </div>
                    </div>
                    <a href="#">Today's Deals</a>
                    <a href="#">Special Event</a>
                </div>
            </div>
            <div class="icons">
                <a href="../favorite_page/favorite.html"><i class="far fa-heart"></i></a>
                <a href="../Profile/profile.html"><i class="far fa-user"></i></a>
                <a href="../product_cart/product_cart.html" class="svg-cart">
                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_90_3688)">
                            <path
                                d="M7.875 19.25C8.35825 19.25 8.75 18.8582 8.75 18.375C8.75 17.8918 8.35825 17.5 7.875 17.5C7.39175 17.5 7 17.8918 7 18.375C7 18.8582 7.39175 19.25 7.875 19.25Z"
                                stroke="#2E3A59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M17.5 19.25C17.9832 19.25 18.375 18.8582 18.375 18.375C18.375 17.8918 17.9832 17.5 17.5 17.5C17.0168 17.5 16.625 17.8918 16.625 18.375C16.625 18.8582 17.0168 19.25 17.5 19.25Z"
                                stroke="#2E3A59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path
                                d="M0.875 0.875H4.375L6.72 12.5913C6.80001 12.9941 7.01917 13.356 7.3391 13.6135C7.65904 13.8711 8.05936 14.0079 8.47 14H16.975C17.3856 14.0079 17.786 13.8711 18.1059 13.6135C18.4258 13.356 18.645 12.9941 18.725 12.5913L20.125 5.25H5.25"
                                stroke="#2E3A59" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_90_3688">
                                <rect width="21" height="21" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                </a>
                <a href="#" id="menu-vertical"><i class="fa-solid fa-ellipsis-vertical"></i>

                    <div class="input">
                        <a href="../Home Page/index.html">
                            <button class="value">
                                <span class="material-symbols-outlined"> home </span>
                                Home
                            </button></a>
                        <a href="../product_listing/product_listing.html">
                            <button class="value">
                                <span class="material-symbols-outlined"> category </span>
                                All Products
                            </button></a>
                        <a href="../product_listing/product_listing.html">
                            <button class="value">
                                <span class="material-symbols-outlined"> event </span>
                                Today's deals
                            </button></a>
                        <a href="../product_listing/product_listing.html">
                            <button class="value">
                                <span class="material-symbols-outlined"> stars </span>
                                Special Event
                            </button></a>
                        <a href="#">
                            <button class="value">
                                <span class="material-symbols-outlined"> notifications </span>
                                Notifications
                            </button>
                        </a>
                    </div>
                </a>
            </div>
        </div>
    </header>
    <!-- Navigation bar Ends-->

    <!-- Main section -->
    <main class="lg:mx-[60px] mx-[20px] sm:my-10">
        <!-- breadcrumb  -->
        <nav aria-label="Breadcrumb">
            <ol class="flex items-center gap-1 text-sm text-gray-600">
                <li>
                    <a href="../Home Page/index.html"
                        class="block transition no-underline decoration-0 hover:text-gray-700">
                        <span class="sr-only"> Home </span>

                        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </a>
                </li>

                <li class="rtl:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                </li>

                <li>
                    <a href="#" class="text-gray-500 cursor-not-allowed" aria-disabled="true">
                        <?= htmlspecialchars($product['product_name']) ?>
                    </a>
                </li>
            </ol>
        </nav>
        <!-- breadcrumb ends  -->


        <div class="product-info w-full min-h-screen p-4 flex flex-col md:flex-row items-start gap-8">
            <div class="w-full md:w-1/2 flex justify-center">
                <img src="<?= htmlspecialchars($product['product_image']) ?>" alt="Product Image"
                    class="max-w-full h-auto">
            </div>
            <div class="w-full md:w-1/2 space-y-4">
                <h1 class="title-product text-2xl font-semibold"><?= htmlspecialchars($product['product_name']) ?></h1>
                <div class="rating-product flex items-center space-x-2 text-yellow-500">
                    <span>⭐⭐⭐⭐☆</span>
                    <span class="text-gray-500 text-sm">(150 Reviews)</span>
                    <span class="<?php echo ($product['quantity'] > 0 ? 'text-green-500' : 'text-red-500') ?>">
                        | <?php echo ($product['quantity'] > 0 ? 'In Stock' : 'Out of Stock') ?>
                    </span>

                </div>
                <div class="price flex gap-1.5 items-end">
                    <p class="price-selling font-medium">₹<?= number_format($product['selling_price'], 2) ?></p>
                    <p class="price-actual font-medium"><s>₹<?= number_format($product['actual_price'], 2) ?></s></p>
                </div>
                <p class="product-desc text-gray-600"><?= nl2br(htmlspecialchars($product['product_description'])) ?>
                </p>
                <hr>
                <!-- <div>
                    <span class="font-semibold">Colours:</span>
                    <button class="w-5 h-5 rounded-full border-2 border-gray-500 ml-2"></button>
                    <button class="w-5 h-5 rounded-full bg-red-500 border-2 border-gray-500 ml-2"></button>
                </div> -->
                <div>
                    <?php 
    $category = $product['product_category'] ?? '';
    if($category && $category !== 'electronics'): 
    ?>
                    <span class="font-semibold">Size:</span>
                    <div class="flex space-x-2 mt-2">
                        <?php
            $sizes = match($category) {
                'clothes' => ['S', 'M', 'L', 'X', 'XL', 'XXL'],
                'Watches' => ['X', 'S/M', 'L/XL'],
                'shoes' => ['7', '8', '9', '10', '11'],
                default => []
            };
            
            foreach ($sizes as $index => $size) {
                // Apply your original button styling
                $buttonClass = 'size-btn px-4 py-2 border border-gray-400 cursor-pointer ';
                
                // Add active state for the middle button (preserving your original M button style)
                if($index === 1) { // Second button (M in clothes, 8 in shoes, etc)
                    $buttonClass .= 'bg-black text-white';
                }
                
                echo '<button class="'.$buttonClass.'">' 
                     . htmlspecialchars($size) . 
                     '</button>';
            }
            ?>
                    </div>
                    <?php endif; ?>
                </div>
                <span class="font-semibold">Quantity:</span>
                <div class="flex justify-between items-center space-x-4 mt-4">

                    <div class="flex items-center border border-gray-400">
                        <button class="quantity-btn px-3 py-2 border-r-2 border-gray-400">-</button>
                        <input type="text" value="2" class="w-10 text-center border-none">
                        <button class="quantity-btn px-3 py-2 bg-black text-white">+</button>
                    </div>

                    <!-- like button -->
                    <!-- From Uiverse.io by Yaya12085 -->
                    <label class="add-to-favorite ui-like border p-1.5 rounded-lg"
                        data-product-id=<?= htmlspecialchars($product['product_id']) ?> data-is-favorite="false">
                        <input type="checkbox">
                        <div class="like">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="">
                                <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                                <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path
                                        d="M20.808,11.079C19.829,16.132,12,20.5,12,20.5s-7.829-4.368-8.808-9.421C2.227,6.1,5.066,3.5,8,3.5a4.444,4.444,0,0,1,4,2,4.444,4.444,0,0,1,4-2C18.934,3.5,21.773,6.1,20.808,11.079Z">
                                    </path>
                                </g>
                            </svg>
                        </div>
                    </label>

                </div>

                <!-- buttons -->
                <div class="buttons w-full flex flex-wrap sm:flex-nowrap gap-2">
                    <!-- buy now -->
                    <button type="button"
                        class="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full sm:w-1/2 cursor-pointer"
                        <?php echo ($product['quantity'] > 0) ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'; ?>
                        <?php echo ($product['quantity'] > 0) ? '' : 'disabled'; ?>
                        onclick="handleBuyNow(<?= htmlspecialchars($product['product_id']) ?>)">
                        Buy Now
                    </button>

                    <!-- add to cart -->
                    <button type="button" data-product-id="<?= htmlspecialchars($product['product_id']) ?>"
                        class="add-to-cart text-blue-500 border bg-white hover:bg-gray-100 cursor-pointer focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55 w-full sm:w-1/2 justify-center">
                        <span class="material-symbols-outlined">add_shopping_cart</span>
                        Add to Cart
                    </button>
                </div>



                <div class="mt-6 border p-4">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined">delivery_truck_speed</span>
                        <div class="ml-2">
                            <p class="font-bold">Free Delivery</p>
                            <p class="text-blue-500 text-sm">Enter your postal code for Delivery Availability</p>
                        </div>
                    </div>
                </div>
                <div class="mt-4 border p-4">
                    <div class="flex items-center">
                        <span class="material-symbols-outlined">cycle</span>
                        <div class="ml-2">
                            <p class="font-bold">Return Delivery</p>
                            <p class="text-sm">Free 30 Days Delivery Returns. <span class="text-blue-500">Details</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>
    <!-- Main section ends -->

    <!-- Bottom Navigation -->
    <section>
    <a href="../Home Page/index.html">
        <label title="Home" for="home" class="label active">
            <span class="material-symbols-outlined">home</span>
            <span class="icon-label">Home</span>
        </label>
    </a>
    <a href="../product_cart/product_cart.html">
        <label title="Cart" for="cart" class="label">
            <span class="material-symbols-outlined">shopping_bag</span>
            <span class="icon-label">Cart</span>
        </label>
    </a>
    <a href="../favorite_page/favorite.html">
        <label title="Favorite" for="favorite" class="label">
            <span class="material-symbols-outlined">favorite</span>
            <span class="icon-label">Favorite</span>
        </label>
    </a>
    <a href="#notifications">
        <label title="Notifications" for="notifications" class="label">
            <span class="material-symbols-outlined">notifications</span>
            <span class="icon-label">Notifications</span>
        </label>
    </a>
    <a href="../Profile/profile.html">
        <label title="Profile" for="profile" class="label">
            <span class="material-symbols-outlined">person</span>
            <span class="icon-label">Profile</span>
        </label>
    </a>
</section>
    <!-- Bottom Navigation ends -->

    <!-- footer -->
    <footer class="footer">
        <div class="footer-left">
            <h2 class="footer-logo">PMART</h2>
            <p class="footer-description">
                Ecommerce is a free UI Kit from Paperpillar that you can use for your
                personal or commercial project.
            </p>
            <div class="footer-email">
                <input type="email" placeholder="Type your email address" class="footer-input" />
                <button class="footer-submit">Submit</button>
            </div>
        </div>

        <div class="footer-right">
            <div class="footer-row">
                <div class="footer-column">
                    <h3>POPULAR</h3>
                    <ul>
                        <li>Shoes</li>
                        <li>Clothes</li>
                        <li>Watches</li>
                        <li>Electronics</li>
                        <li>Accessories</li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>MENU</h3>
                    <ul>
                        <li>All Category</li>
                        <li>Today's Deals</li>
                        <li>Special Events</li>
                        <li>Testimonial</li>
                        <li>Blog</li>
                    </ul>
                </div>
            </div>
            <div class="footer-column">
                <h3>OTHER</h3>
                <ul>
                    <li>Feedback</li>
                    <li>FAQ</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Terms and Conditions</li>
                </ul>
            </div>
        </div>
    </footer>
    <!-- footer ends -->

    <script src="../Home Page/script.js"></script>
    <script src="./product_details.js"></script>
    <script src="../product_cart/cart.js"></script>
    <script src="../favorite_page/favorite.js"></script>
</body>

</html>