// DOM Elements
const navLinks = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('.content-section');
const logoutBtn = document.getElementById('logoutBtn');
const modals = document.querySelectorAll('.modal');
const closeBtns = document.querySelectorAll('.close-btn, .cancel-btn');

// Admin password from config
const ADMIN_PASSWORD = window.APP_CONFIG?.ADMIN_PASSWORD || 'admin123';

// Works Management
let works = [];
let skills = [];
let hobbies = [];

function loadAndDisplayData() {
    console.log('Loading data from localStorage...');
    
    // Load works
    const savedWorks = localStorage.getItem('portfolioWorks');
    console.log('Saved works:', savedWorks);
    works = savedWorks ? JSON.parse(savedWorks) : [];
    
    // Load skills
    const savedSkills = localStorage.getItem('portfolioSkills');
    console.log('Saved skills:', savedSkills);
    if (savedSkills) {
        skills = JSON.parse(savedSkills);
    } else {
        skills = [
            {
                id: 1,
                name: "Python3",
                iconType: "fontawesome",
                iconValue: "fab fa-python"
            },
            {
                id: 2,
                name: "HTML5",
                iconType: "fontawesome",
                iconValue: "fab fa-html5"
            },
            {
                id: 3,
                name: "CSS3",
                iconType: "fontawesome",
                iconValue: "fab fa-css3-alt"
            },
            {
                id: 4,
                name: "JavaScript",
                iconType: "fontawesome",
                iconValue: "fab fa-js"
            }
        ];
        localStorage.setItem('portfolioSkills', JSON.stringify(skills));
    }
    
    // Load hobbies
    const savedHobbies = localStorage.getItem('portfolioHobbies');
    console.log('Saved hobbies:', savedHobbies);
    if (savedHobbies) {
        hobbies = JSON.parse(savedHobbies);
    } else {
        hobbies = [
            {
                id: 1,
                name: "AI Driven Development",
                iconType: "fontawesome",
                iconValue: "fas fa-laptop-code"
            },
            {
                id: 2,
                name: "Latest Tech News",
                iconType: "fontawesome",
                iconValue: "fas fa-newspaper"
            },
            {
                id: 3,
                name: "Reading Books",
                iconType: "fontawesome",
                iconValue: "fas fa-book"
            }
        ];
        localStorage.setItem('portfolioHobbies', JSON.stringify(hobbies));
    }
    
    console.log('Displaying data...');
    console.log('Works:', works);
    console.log('Skills:', skills);
    console.log('Hobbies:', hobbies);
    
    // Display all data
    displayWorks();
    displaySkills();
    displayHobbies();
}

function displayWorks() {
    console.log('Displaying works...');
    const worksList = document.getElementById('worksList');
    if (!worksList) {
        console.error('Works list element not found!');
        return;
    }
    
    worksList.innerHTML = works.map(work => `
        <div class="item-card">
            ${work.image ? `<img src="${work.image}" alt="${work.title}">` : ''}
            <h3>${work.title}</h3>
            <p class="item-description">${work.description}</p>
            <div class="admin-actions">
                <button onclick="editWork(${work.id})" class="edit-button">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="deleteWork(${work.id})" class="delete-button">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

function displaySkills() {
    console.log('Displaying skills...');
    const skillsList = document.getElementById('skillsList');
    if (!skillsList) {
        console.error('Skills list element not found!');
        return;
    }
    
    skillsList.innerHTML = skills.map(skill => `
        <div class="item-card">
            <div class="card-content">
                <div class="skill-icon">
                    ${getSkillIcon(skill)}
                </div>
                <h3>${skill.name}</h3>
                <div class="admin-actions">
                    <button onclick="editSkill(${skill.id})" class="edit-button">
                        <i class="fas fa-edit"></i>
                        <span>Edit</span>
                    </button>
                    <button onclick="deleteSkill(${skill.id})" class="delete-button">
                        <i class="fas fa-trash"></i>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .item-card {
            background: var(--card-bg);
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            box-sizing: border-box;
        }

        .item-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .card-content {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            box-sizing: border-box;
        }

        .skill-icon, .hobby-icon {
            width: 60px;
            height: 60px;
            background: var(--surface-color);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 0.5rem;
            font-size: 1.75rem;
            color: var(--primary-color);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .item-card h3 {
            margin: 0;
            font-size: 1.25rem;
            color: var(--text-color);
            margin-bottom: 1rem;
        }

        .admin-actions {
            display: flex;
            gap: 0.75rem;
            opacity: 0;
            transition: opacity 0.3s ease;
            margin-top: auto;
            width: 100%;
            box-sizing: border-box;
        }

        .item-card:hover .admin-actions {
            opacity: 1;
        }

        .edit-button, .delete-button {
            padding: 0.5rem;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.875rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
            color: white;
            flex: 1;
            width: 100%;
            box-sizing: border-box;
            min-width: 0;
        }

        .edit-button {
            background-color: var(--primary-color);
        }

        .delete-button {
            background-color: var(--danger-color);
        }

        .edit-button:hover, .delete-button:hover {
            filter: brightness(1.1);
        }

        .edit-button:active, .delete-button:active {
            filter: brightness(0.95);
        }

        .edit-button i, .delete-button i {
            font-size: 0.875rem;
            flex-shrink: 0;
        }

        .edit-button span, .delete-button span {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        @media (max-width: 768px) {
            .item-card {
                padding: 1.25rem;
            }

            .skill-icon, .hobby-icon {
                width: 50px;
                height: 50px;
                font-size: 1.5rem;
            }

            .admin-actions {
                opacity: 1;
            }

            .edit-button, .delete-button {
                padding: 0.5rem;
            }

            .edit-button span, .delete-button span {
                display: none;
            }

            .edit-button i, .delete-button i {
                margin: 0;
                font-size: 1rem;
            }
        }
    `;
    document.head.appendChild(style);
}

function displayHobbies() {
    console.log('Displaying hobbies...');
    const hobbiesList = document.getElementById('hobbiesList');
    if (!hobbiesList) {
        console.error('Hobbies list element not found!');
        return;
    }
    
    hobbiesList.innerHTML = hobbies.map(hobby => `
        <div class="item-card">
            <div class="card-content">
                <div class="hobby-icon">
                    ${getHobbyIcon(hobby)}
                </div>
                <h3>${hobby.name}</h3>
                <div class="admin-actions">
                    <button onclick="editHobby(${hobby.id})" class="edit-button">
                        <i class="fas fa-edit"></i>
                        <span>Edit</span>
                    </button>
                    <button onclick="deleteHobby(${hobby.id})" class="delete-button">
                        <i class="fas fa-trash"></i>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Logout function
function logout() {
    sessionStorage.removeItem('adminAuthenticated');
    window.location.href = 'login.html';
}

// Check authentication
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
        window.location.href = 'login.html';
        return;
    }
}

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const targetSection = link.getAttribute('data-section');
        
        // Update active states
        navLinks.forEach(l => l.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        
        link.classList.add('active');
        document.getElementById(targetSection).classList.add('active');
    });
});

// Tab functionality
function showTab(tabId) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabId).classList.add('active');
    
    // Add active class to clicked button
    document.querySelector(`.tab-button[onclick="showTab('${tabId}')"]`).classList.add('active');
}

// Modal handling
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        modal.classList.remove('active');
    });
});

// Works Management
function openAddWorkModal() {
    document.getElementById('workId').value = '';
    document.getElementById('workForm').reset();
    openModal('workModal');
}

function editWork(id) {
    const work = works.find(w => w.id === id);
    if (work) {
        document.getElementById('workId').value = work.id;
        document.getElementById('workTitle').value = work.title;
        document.getElementById('workDescription').value = work.description;
        document.getElementById('workImage').value = work.image || '';
        document.getElementById('workLink').value = work.link || '';
        openModal('workModal');
    }
}

function deleteWork(id) {
    if (confirm('Are you sure you want to delete this work?')) {
        works = works.filter(w => w.id !== id);
        localStorage.setItem('portfolioWorks', JSON.stringify(works));
        displayWorks();
    }
}

// Skills Management
function openAddSkillModal() {
    document.getElementById('skillId').value = '';
    document.getElementById('skillForm').reset();
    openModal('skillModal');
}

function editSkill(id) {
    const skill = skills.find(s => s.id === id);
    if (skill) {
        document.getElementById('skillId').value = skill.id;
        document.getElementById('skillName').value = skill.name;
        document.getElementById('iconType').value = skill.iconType;
        document.getElementById('iconValue').value = skill.iconValue;
        handleIconTypeChange();
        openModal('skillModal');
    }
}

function deleteSkill(id) {
    if (confirm('Are you sure you want to delete this skill?')) {
        skills = skills.filter(s => s.id !== id);
        localStorage.setItem('portfolioSkills', JSON.stringify(skills));
        displaySkills();
    }
}

// Hobbies Management
function openAddHobbyModal() {
    document.getElementById('hobbyId').value = '';
    document.getElementById('hobbyForm').reset();
    openModal('hobbyModal');
}

function editHobby(id) {
    const hobby = hobbies.find(h => h.id === id);
    if (hobby) {
        document.getElementById('hobbyId').value = hobby.id;
        document.getElementById('hobbyName').value = hobby.name;
        document.getElementById('hobbyIconType').value = hobby.iconType;
        document.getElementById('hobbyIconValue').value = hobby.iconValue;
        handleHobbyIconTypeChange();
        openModal('hobbyModal');
    }
}

function deleteHobby(id) {
    if (confirm('Are you sure you want to delete this hobby?')) {
        hobbies = hobbies.filter(h => h.id !== id);
        localStorage.setItem('portfolioHobbies', JSON.stringify(hobbies));
        displayHobbies();
    }
}

// Form submissions
document.getElementById('workForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        id: document.getElementById('workId').value ? parseInt(document.getElementById('workId').value) : Date.now(),
        title: document.getElementById('workTitle').value,
        description: document.getElementById('workDescription').value,
        image: document.getElementById('workImage').value,
        link: document.getElementById('workLink').value
    };

    if (document.getElementById('workId').value) {
        works = works.map(w => w.id === formData.id ? formData : w);
    } else {
        works.push(formData);
    }

    localStorage.setItem('portfolioWorks', JSON.stringify(works));
    displayWorks();
    closeModal('workModal');
});

document.getElementById('skillForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        id: document.getElementById('skillId').value ? parseInt(document.getElementById('skillId').value) : Date.now(),
        name: document.getElementById('skillName').value,
        iconType: document.getElementById('iconType').value,
        iconValue: document.getElementById('iconValue').value
    };

    if (document.getElementById('skillId').value) {
        skills = skills.map(s => s.id === formData.id ? formData : s);
    } else {
        skills.push(formData);
    }

    localStorage.setItem('portfolioSkills', JSON.stringify(skills));
    displaySkills();
    closeModal('skillModal');
});

document.getElementById('hobbyForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        id: document.getElementById('hobbyId').value ? parseInt(document.getElementById('hobbyId').value) : Date.now(),
        name: document.getElementById('hobbyName').value,
        iconType: document.getElementById('hobbyIconType').value,
        iconValue: document.getElementById('hobbyIconValue').value
    };

    if (document.getElementById('hobbyId').value) {
        hobbies = hobbies.map(h => h.id === formData.id ? formData : h);
    } else {
        hobbies.push(formData);
    }

    localStorage.setItem('portfolioHobbies', JSON.stringify(hobbies));
    displayHobbies();
    closeModal('hobbyModal');
});

document.getElementById('personalInfoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        fullName: document.getElementById('fullName').value,
        title: document.getElementById('title').value,
        location: document.getElementById('location').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        linkedin: document.getElementById('linkedin').value,
        github: document.getElementById('github').value,
        instagram: document.getElementById('instagram').value
    };

    localStorage.setItem('portfolioPersonalInfo', JSON.stringify(formData));
    alert('Personal information saved successfully!');
});

// Helper functions
function getSkillIcon(skill) {
    switch (skill.iconType) {
        case 'fontawesome':
            return `<i class="${skill.iconValue}"></i>`;
        case 'devicon':
            return `<img src="${skill.iconValue}" alt="${skill.name}">`;
        case 'custom':
            if (skill.iconValue.startsWith('data:image')) {
                return `<img src="${skill.iconValue}" alt="${skill.name}">`;
            }
            return skill.iconValue;
        default:
            return '<i class="fas fa-code"></i>';
    }
}

function getHobbyIcon(hobby) {
    switch (hobby.iconType) {
        case 'fontawesome':
            return `<i class="${hobby.iconValue}"></i>`;
        case 'devicon':
            return `<img src="${hobby.iconValue}" alt="${hobby.name}">`;
        case 'custom':
            if (hobby.iconValue.startsWith('data:image')) {
                return `<img src="${hobby.iconValue}" alt="${hobby.name}">`;
            }
            return hobby.iconValue;
        default:
            return '<i class="fas fa-star"></i>';
    }
}

// Icon type handling for skills
function handleIconTypeChange() {
    const iconType = document.getElementById('iconType').value;
    const iconValueInput = document.getElementById('iconValue');
    const iconValueLabel = document.querySelector('label[for="iconValue"]');
    
    switch(iconType) {
        case 'fontawesome':
            iconValueLabel.textContent = 'Font Awesome Class';
            iconValueInput.placeholder = 'e.g., fab fa-python';
            break;
        case 'devicon':
            iconValueLabel.textContent = 'Devicon URL';
            iconValueInput.placeholder = 'e.g., https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg';
            break;
        case 'custom':
            iconValueLabel.textContent = 'Custom Icon';
            iconValueInput.placeholder = 'Enter custom HTML or image URL';
            break;
    }
}

// Icon type handling for hobbies
function handleHobbyIconTypeChange() {
    const iconType = document.getElementById('hobbyIconType').value;
    const iconValueInput = document.getElementById('hobbyIconValue');
    const iconValueLabel = document.querySelector('label[for="hobbyIconValue"]');
    
    switch(iconType) {
        case 'fontawesome':
            iconValueLabel.textContent = 'Font Awesome Class';
            iconValueInput.placeholder = 'e.g., fas fa-book';
            break;
        case 'custom':
            iconValueLabel.textContent = 'Custom Icon';
            iconValueInput.placeholder = 'Enter custom HTML or image URL';
            break;
    }
}

// Add event listeners for icon type changes
document.addEventListener('DOMContentLoaded', () => {
    const iconTypeSelect = document.getElementById('iconType');
    const hobbyIconTypeSelect = document.getElementById('hobbyIconType');
    
    if (iconTypeSelect) {
        iconTypeSelect.addEventListener('change', handleIconTypeChange);
    }
    
    if (hobbyIconTypeSelect) {
        hobbyIconTypeSelect.addEventListener('change', handleHobbyIconTypeChange);
    }
    
    console.log('DOM Content Loaded');
    checkAuth();
    loadAndDisplayData();
    
    // Load personal info
    const personalInfo = JSON.parse(localStorage.getItem('portfolioPersonalInfo')) || {};
    console.log('Personal Info:', personalInfo);
    Object.keys(personalInfo).forEach(key => {
        const input = document.getElementById(key);
        if (input) {
            input.value = personalInfo[key];
        }
    });
    
    // Show initial tab
    showTab('works');
});

logoutBtn.addEventListener('click', logout); 