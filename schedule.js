const scheduleContainer = document.getElementById("schedule");

// Danh sách giờ sáng ngoài giờ (phụ thu)
const earlyHours = ["06:00", "06:30", "07:00", "07:30"];
// Giờ làm việc chính (08:00 đến 20:00 mỗi giờ 1 lần)

// Giờ tối ngoài giờ (phụ thu)
const lateHours = ["20:30", "21:00", "21:30", "22:00"];
const normalHours = Array.from({ length: 13 }, (_, i) => {
  const hour = 8 + i; // từ 08h đến 20h
  return `${hour.toString().padStart(2, "0")}:00`;
});
// Giả sử những giờ này đã được đặt
const bookedHours = ["08:00", "11:00", "19:00"];

function tạoNútGiờ(hour, type) {
  const button = document.createElement("button");
  button.innerText = hour;
  button.className = "hour-btn";

  if (type === "extra") {
    button.classList.add("extra");
    button.innerText += " (+20k)";
  }

  if (bookedHours.includes(hour)) {
    button.disabled = true;
    button.classList.add("disabled");
  }

  button.addEventListener("click", () => {
    // Gán vào input hidden và hiển thị ra màn hình
    document.getElementById('selectedHour').value = hour;
    document.getElementById('selectedTimeDisplay').innerText = hour;
  
    alert(`Đã chọn giờ: ${hour}`);
  });

  scheduleContainer.appendChild(button);
}

earlyHours.forEach(h => tạoNútGiờ(h, "extra"));
normalHours.forEach(h => tạoNútGiờ(h, "normal"));
lateHours.forEach(h => tạoNútGiờ(h, "extra"));
// Khi người dùng chọn ngày, hiển thị lại danh sách giờ
document.getElementById("selectedDate").addEventListener("change", () => {
  const selectedDate = document.getElementById("selectedDate").value;

  // Xoá toàn bộ giờ cũ trong khung lịch
  scheduleContainer.innerHTML = "";

  // Ví dụ: bạn có thể dùng selectedDate để kiểm tra lịch đặt thực tế từ database hoặc file JSON

  // Tạo lại danh sách giờ như bình thường
  earlyHours.forEach(h => taoNutGio(h, "extra"));
  normalHours.forEach(h => taoNutGio(h, "normal"));
  lateHours.forEach(h => taoNutGio(h, "extra"));
});