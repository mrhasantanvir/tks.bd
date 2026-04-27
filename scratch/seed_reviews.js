const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedReviews() {
  const reviews = [
    {
      user_name: "আনিসুর রহমান",
      comment: "হিমসাগর আমগুলো অসাধারণ ছিল। ঘ্রাণে মনে হলো রাজশাহীর নিজ বাড়িতে আছি। প্যাকিংও খুব মজবুত ছিল।",
      rating: 5,
      image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anisur"
    },
    {
      user_name: "সুলতানা কামাল",
      comment: "খাঁটি মধুর আসল স্বাদ পেলাম। সুপারমার্কেটের ব্র্যান্ডের চেয়ে অনেক ভালো। ডেলিভারি খুব দ্রুত হয়েছে।",
      rating: 5,
      image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sultana"
    },
    {
      user_name: "ডা. ফারহান",
      comment: "প্যাকেজিং খুব ভালো ছিল। একটি আমও নষ্ট হয়নি। অর্গানিক ফলের জন্য নির্ভরযোগ্য একটি শপ। শুভকামনা রইল।",
      rating: 4,
      image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Farhan"
    },
    {
      user_name: "রফিকুল ইসলাম",
      comment: "চায়ের লিকার খুব কড়া এবং সুগন্ধি। প্রতিদিন সকালে এটিই চাই। গুড়গুলোও বেশ ফ্রেশ ছিল।",
      rating: 5,
      image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rafiqul"
    },
    {
      user_name: "মালিহা জামান",
      comment: "গুড়গুলো একদম খাঁটি ছিল। পিঠা বানানোর জন্য পারফেক্ট। সার্ভিস নিয়ে কোনো অভিযোগ নেই।",
      rating: 5,
      image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maliha"
    },
    {
      user_name: "জাহিদ হাসান",
      comment: "প্রি-অর্ডার করেছিলাম, সময়মতো ডেলিভারি পেয়েছি। ফলের মান খুব ভালো। ধন্যবাদ TKS.bd কে।",
      rating: 5,
      image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zahid"
    },
    {
      user_name: "নুসরাত জাহান",
      comment: "রাজশাহীর আমের আসল স্বাদ অনেকদিন পর পেলাম। সন্তানদের খুব পছন্দ হয়েছে।",
      rating: 4,
      image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nusrat"
    },
    {
      user_name: "ইমতিয়াজ আহমেদ",
      comment: "অর্গানিক পণ্যের জন্য নির্ভরযোগ্য একটি সপ। আমের সাইজগুলোও বেশ বড় এবং সমান ছিল।",
      rating: 5,
      image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Imtiaz"
    },
    {
      user_name: "কামরুল ইসলাম",
      comment: "কালো চা টা সত্যিই প্রিমিয়াম কোয়ালিটির। অনেকদিন পর ভালো মানের চা খেলাম।",
      rating: 5,
      image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kamrul"
    },
    {
      user_name: "সাবিনা ইয়াসমিন",
      comment: "সব আমের মান এক ছিল। কোনো রাসায়নিকের গন্ধ নেই। ফ্রেশ ফলের জন্য সেরা জায়গা।",
      rating: 5,
      image_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sabina"
    }
  ];

  try {
    // Clear old reviews first to avoid duplicates in demo
    await prisma.reviews.deleteMany({ where: { user_id: null } });
    
    await prisma.reviews.createMany({
      data: reviews
    });
    console.log("10 Demo Reviews Seeded Successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

seedReviews();
