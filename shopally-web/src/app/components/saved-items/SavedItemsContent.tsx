import SavedItemCard from "@/app/components/saved-items/SavedItemCard";

const savedItems = [
  {
    title: "MacBook Air M2 13-inch Laptop - Space Gray",
    rating: 4.8,
    ratingCount: 1250,
    price: "45,000 ETB",
    oldPrice: "$810",
    seller: "Apple Store Official",
    checked: "2h",
    priceAlertOn: true,
    placeholderText: "MacBook Air",
  },
  {
    title: "Wireless Bluetooth Headphones with Noise Cancellation",
    rating: 3.5,
    ratingCount: 892,
    price: "2,500 ETB",
    oldPrice: "$45",
    seller: "TechGear Pro",
    checked: "4h",
    priceAlertOn: false,
    placeholderText: "Headphones",
  },
  {
    title: "Wireless Bluetooth Headphones with Noise Cancellation",
    rating: 3.5,
    ratingCount: 892,
    price: "2,500 ETB",
    oldPrice: "$45",
    seller: "TechGear Pro",
    checked: "4h",
    priceAlertOn: false,
    placeholderText: "Headphones",
  },
  {
    title: "Wireless Bluetooth Headphones with Noise Cancellation",
    rating: 3.5,
    ratingCount: 892,
    price: "2,500 ETB",
    oldPrice: "$45",
    seller: "TechGear Pro",
    checked: "4h",
    priceAlertOn: false,
    placeholderText: "Headphones",
  },
  {
    title: "Wireless Bluetooth Headphones with Noise Cancellation",
    rating: 3.5,
    ratingCount: 892,
    price: "2,500 ETB",
    oldPrice: "$45",
    seller: "TechGear Pro",
    checked: "4h",
    priceAlertOn: false,
    placeholderText: "Headphones",
  },
  {
    title: "Wireless Bluetooth Headphones with Noise Cancellation",
    rating: 3.5,
    ratingCount: 892,
    price: "2,500 ETB",
    oldPrice: "$45",
    seller: "TechGear Pro",
    checked: "4h",
    priceAlertOn: false,
    placeholderText: "Headphones",
  },
];

export default function SavedItemsContent() {
  return (
    <div>
      {savedItems.map((item, index) => (
        <SavedItemCard key={index} {...item} />
      ))}
    </div>
  );
}
