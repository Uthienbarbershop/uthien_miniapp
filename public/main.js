// main.js - Script chung cho Mini App

document.addEventListener('DOMContentLoaded', () => {
  console.log("🎉 Út Hiền Mini App đã tải xong!");

  // Gợi ý: xử lý menu động
  const menuItems = document.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      alert(`Bạn chọn: ${item.innerText}`);
    });
  });

  // Tự động focus vào input đầu tiên (nếu có)
  const firstInput = document.querySelector('input');
  if (firstInput) firstInput.focus();
});