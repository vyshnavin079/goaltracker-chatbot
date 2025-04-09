const goalList = document.getElementById("goalList");
const goalInput = document.getElementById("goalInput");

// Star animation setup
const starsContainer = document.querySelector('.stars');
const numberOfStars = 50;

function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Randomize star properties
    const size = Math.random() * 3 + 1;
    const startPosition = Math.random() * window.innerWidth;
    const duration = Math.random() * 3 + 2;
    const delay = Math.random() * 2;
    
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${startPosition}px`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;
    
    starsContainer.appendChild(star);
}

// Add at the beginning after const declarations
let chart;

function createProgressChart() {
    const ctx = document.getElementById('progressChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#28a745', '#e9ecef']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Modify the addGoal function
function addGoal() {
    const goal = goalInput.value.trim();
    if (goal) {
        const li = document.createElement("li");
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";
        
        const doneBtn = document.createElement("button");
        doneBtn.textContent = "✓";
        doneBtn.className = "done-btn";
        doneBtn.onclick = () => toggleGoal(li);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteGoal(li);
        
        buttonContainer.appendChild(doneBtn);
        buttonContainer.appendChild(deleteBtn);
        
        li.textContent = goal;
        li.appendChild(buttonContainer);
        li.dataset.completed = "false";
        goalList.appendChild(li);
        saveGoal({ text: goal, completed: false });
        goalInput.value = "";
        updateProgress();
    }
}

function deleteGoal(li) {
    li.classList.add("fade-out");
    setTimeout(() => {
        li.remove();
        saveAllGoals();
        updateProgress();
    }, 300);
}

function toggleGoal(li) {
    li.dataset.completed = li.dataset.completed === "true" ? "false" : "true";
    li.classList.toggle("completed");
    saveAllGoals();
    updateProgress();
}

function updateProgress() {
    const goals = Array.from(goalList.children);
    const total = goals.length;
    const completed = goals.filter(g => g.dataset.completed === "true").length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;
    
    document.getElementById('progressText').textContent = `${percentage}% Complete`;
    chart.data.datasets[0].data = [completed, total - completed];
    chart.update();
}

// Modify saveGoal and loadGoals functions
function saveGoal(goal) {
    let goals = JSON.parse(localStorage.getItem("goals") || "[]");
    goals.push(goal);
    localStorage.setItem("goals", JSON.stringify(goals));
}

function saveAllGoals() {
    const goals = Array.from(goalList.children).map(li => ({
        text: li.childNodes[0].textContent,
        completed: li.dataset.completed === "true"
    }));
    localStorage.setItem("goals", JSON.stringify(goals));
}

function loadGoals() {
    let goals = JSON.parse(localStorage.getItem("goals") || "[]");
    goals.forEach(g => {
        const li = document.createElement("li");
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";
        
        const doneBtn = document.createElement("button");
        doneBtn.textContent = "✓";
        doneBtn.className = "done-btn";
        doneBtn.onclick = () => toggleGoal(li);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "×";
        deleteBtn.className = "delete-btn";
        deleteBtn.onclick = () => deleteGoal(li);
        
        buttonContainer.appendChild(doneBtn);
        buttonContainer.appendChild(deleteBtn);
        
        li.textContent = g.text;
        li.appendChild(buttonContainer);
        li.dataset.completed = g.completed;
        if (g.completed) li.classList.add("completed");
        goalList.appendChild(li);
    });
    updateProgress();
}

// Add after createStars();
createProgressChart();

loadGoals();

const chatBox = document.getElementById("chatBox");
const chatInput = document.getElementById("chatInput");

async function generate(prompt) {
    try {
        const response = await fetch('http://localhost:3000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        return data.text;
    } catch (error) {
        console.error('Generation error:', error);
        throw error;
    }
}

async function sendMessage() {
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;

    chatBox.innerHTML += `<div><strong>You:</strong> ${userMsg}</div>`;
    chatInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const reply = await generate(userMsg);
        if (reply) {
            chatBox.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
        } else {
            throw new Error('Empty response');
        }
    } catch (error) {
        console.error('Chat error:', error);
        chatBox.innerHTML += `<div><strong>Bot:</strong> I apologize, but I'm having trouble responding right now. Please try again.</div>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

chatInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});


// Add at the end of your script.js file
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.animationDuration = `${Math.random() * 3 + 2}s`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        starsContainer.appendChild(star);
    }
}

createStars();
