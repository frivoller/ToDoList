// DOM elementlerini seçme
const taskInput = document.getElementById("task");
const addButton = document.getElementById("liveToastBtn");
const todoList = document.getElementById("list");
const toastSuccess = document.getElementById("liveToast-success");
const toastError = document.getElementById("liveToast-error");

// Uygulamanın çalışmasını başlat
loadTodos();
addEventListeners();

// Sayfa yüklendiğinde eventListener'ları ekle
function addEventListeners() {
  addButton.addEventListener("click", addNewTask);
  taskInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      addNewTask();
    }
  });
  
  // Varolan görevlere tıklandığında işlemi tamamlama özelliği ekle
  todoList.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
      toggleTask(e.target);
    }
  });
}

// Yeni görev ekleme fonksiyonu
function addNewTask() {
  const taskText = taskInput.value.trim();
  
  if (taskText === "") {
    showToast(toastError); // Boş görev eklenemez
    return;
  }
  
  // Yeni görev öğesi oluştur
  const li = document.createElement("li");
  li.textContent = taskText;
  
  // Silme butonu oluştur
  const deleteButton = document.createElement("span");
  deleteButton.textContent = "×";
  deleteButton.className = "close";
  deleteButton.addEventListener("click", function() {
    removeTask(li);
  });
  
  li.appendChild(deleteButton);
  todoList.appendChild(li);
  
  // Input alanını temizle
  taskInput.value = "";
  
  // Başarılı toast bildirimini göster
  showToast(toastSuccess);
  
  // Local storage'a kaydet
  saveTodos();
}

// Görevi tamamlandı olarak işaretleme
function toggleTask(taskElement) {
  taskElement.classList.toggle("checked");
  saveTodos();
}

// Görevi silme
function removeTask(taskElement) {
  taskElement.remove();
  saveTodos();
}

// Toast bildirimini gösterme
function showToast(toastElement) {
  const toast = new bootstrap.Toast(toastElement);
  toast.show();
}

// Local Storage'a görevleri kaydetme
function saveTodos() {
  const tasks = [];
  
  // Mevcut tüm görevleri topla
  document.querySelectorAll("#list li").forEach(function(taskElement) {
    const isCompleted = taskElement.classList.contains("checked");
    const taskText = taskElement.childNodes[0].textContent.trim();
    
    tasks.push({
      text: taskText,
      completed: isCompleted
    });
  });
  
  // Local storage'a kaydet
  localStorage.setItem("todos", JSON.stringify(tasks));
}

// Local Storage'dan görevleri yükleme
function loadTodos() {
  const storedTasks = localStorage.getItem("todos");
  
  if (storedTasks) {
    const tasks = JSON.parse(storedTasks);
    
    tasks.forEach(function(task) {
      // Görev öğesi oluştur
      const li = document.createElement("li");
      li.textContent = task.text;
      
      // Tamamlanmış mı kontrol et
      if (task.completed) {
        li.classList.add("checked");
      }
      
      // Silme butonu oluştur
      const deleteButton = document.createElement("span");
      deleteButton.textContent = "×";
      deleteButton.className = "close";
      deleteButton.addEventListener("click", function() {
        removeTask(li);
      });
      
      li.appendChild(deleteButton);
      todoList.appendChild(li);
    });
  }
}
