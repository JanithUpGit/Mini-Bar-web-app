# Mini-Bar-web-app
online bar stock handle system


/frontend
├── css/
│   └── style.css (හෝ වෙනත් CSS files)
├── js/
│   ├── api.js (API calls සඳහා)
│   ├── main.js (ප්‍රධාන application logic)
│   └── components.js (දැන්වීම් වැනි කොටස් සඳහා)
├── images/
│   └── logo.png
├── index.html (ප්‍රධාන පිටුව)
└── about.html (අනෙකුත් පිටු)

index.html: ප්‍රධාන HTML file එක. ඔබට තව පිටු අවශ්‍ය නම් about.html, contact.html වගේ වෙනත් files එකතු කරන්න පුළුවන්.
css/: වෙබ් අඩවියේ පෙනුම සඳහා අවශ්‍ය සියලු CSS files මෙහි ගබඩා කරනවා.
js/: වෙබ් අඩවියේ interactive functionalities සඳහා අවශ්‍ය සියලු JavaScript files මෙහි ගබඩා කරනවා. ඔබට API calls handle කරන්න වෙනම file එකක් (උදා: api.js) සහ ප්‍රධාන DOM manipulation logic සඳහා වෙනම file එකක් (උදා: main.js) යොදාගන්න පුළුවන්.
images/: ඔබගේ වෙබ් අඩවියට අවශ්‍ය රූප (logos, icons) මෙහි තබන්න.


/backend
├── node_modules/
├── controllers/
│   ├── productController.js
│   ├── orderController.js
│   └── userController.js
├── models/
│   ├── Product.js
│   ├── Order.js
│   └── User.js
├── routes/
│   ├── productRoutes.js
│   ├── orderRoutes.js
│   └── userRoutes.js
├── config/
│   └── db.js (Database සම්බන්ධතාවය සඳහා)
├── middleware/
│   └── authMiddleware.js (Authentication වැනි කාර්යයන් සඳහා)
├── app.js (or server.js)
└── package.json