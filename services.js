fetch("src/services.json")
  .then(response => response.json())
  .then(data => {
    const serviceList = document.getElementById("service-list");

    const renderGroup = (title, services, isCombo = false) => {
      const section = document.createElement("div");
      section.innerHTML = `<h3>${title}</h3>`;
      const ul = document.createElement("ul");

      services.forEach(item => {
        const li = document.createElement("li");
        if (isCombo) {
          li.innerText = `${item.name}: ${item.description} (${item.price})`;
        } else {
          li.innerText = `${item.name}: ${item.price}`;
        }
        ul.appendChild(li);
      });

      section.appendChild(ul);
      serviceList.appendChild(section);
    };

    renderGroup("Dịch vụ cơ bản", data.co_ban);
    renderGroup("Dịch vụ hóa chất", data.hoa_chat);
    renderGroup("Combo", data.combo, true);
  })
  .catch(error => {
    console.error("Lỗi khi tải services.json:", error);
  });