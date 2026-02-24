document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('membership-form');
    const searchInput = document.getElementById('search-input');
    const listContainer = document.getElementById('memberships-list');

    let memberships = JSON.parse(localStorage.getItem('club_memberships')) || [];

    // Initial render
    renderMemberships();

    // Form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newMembership = {
            id: Date.now().toString(),
            name: document.getElementById('person-name').value.trim(),
            store: document.getElementById('store-name').value.trim(),
            memberId: document.getElementById('member-id').value.trim(),
            notes: document.getElementById('notes').value.trim()
        };

        memberships.push(newMembership);
        saveData();
        renderMemberships();
        form.reset();
        
        // Return focus to first input
        document.getElementById('person-name').focus();
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        renderMemberships(searchTerm);
    });

    // Save to LocalStorage
    function saveData() {
        localStorage.setItem('club_memberships', JSON.stringify(memberships));
    }

    // Delete membership
    window.deleteMembership = function(id) {
        if(confirm('האם אתה בטוח שברצונך למחוק מועדון זה?')) {
            memberships = memberships.filter(m => m.id !== id);
            saveData();
            // Re-render with current search filter if any
            renderMemberships(searchInput.value.toLowerCase());
        }
    };

    // Render list
    function renderMemberships(filterText = '') {
        listContainer.innerHTML = '';

        const filtered = memberships.filter(m => 
            m.name.toLowerCase().includes(filterText) || 
            m.store.toLowerCase().includes(filterText)
        );

        if (filtered.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <h3>לא נמצאו כרטיסי מועדון</h3>
                    <p>${filterText ? 'לא נמצאו תוצאות לחיפוש שלך.' : 'הוסף את המועדון הראשון שלך למעלה!'}</p>
                </div>
            `;
            return;
        }

        filtered.forEach(m => {
            const card = document.createElement('div');
            card.className = 'membership-card';
            card.innerHTML = `
                <div class="card-header">
                    <span class="member-name">${escapeHTML(m.name)}</span>
                    <span class="store-badge">${escapeHTML(m.store)}</span>
                </div>
                <div class="card-detail">
                    <span class="detail-label">מספר מועדון / חבר:</span>
                    <span class="detail-value">${escapeHTML(m.memberId)}</span>
                </div>
                ${m.notes ? `
                <div class="card-detail" style="margin-top: 5px;">
                    <span class="detail-label">הערות:</span>
                    <span class="note-value">${escapeHTML(m.notes)}</span>
                </div>` : ''}
                
                <button class="delete-btn" onclick="deleteMembership('${m.id}')" title="מחק השמירה">
                    🗑️
                </button>
            `;
            listContainer.appendChild(card);
        });
    }

    // Utility to prevent XSS
    function escapeHTML(str) {
        const div = document.createElement('div');
        div.innerText = str;
        return div.innerHTML;
    }
});
