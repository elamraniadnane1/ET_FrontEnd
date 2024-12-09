// Mock data for campaigns (in a real application, fetch from backend)
let campaigns = [
    {
        id: 1,
        name: 'Community Energy Saver',
        description: 'Join our community in reducing energy consumption by 15% over the next 30 days.',
        goal: 15,
        duration: 30,
        type: 'community',
        participants: 120,
        joined: false
    },
    {
        id: 2,
        name: 'Green Workplace Initiative',
        description: 'Let\'s make our workplace greener by cutting down energy usage by 10%.',
        goal: 10,
        duration: 60,
        type: 'workplace',
        participants: 80,
        joined: false
    },
    {
        id: 3,
        name: 'School Energy Challenge',
        description: 'Students and staff aim to reduce energy usage by 20% this semester.',
        goal: 20,
        duration: 90,
        type: 'school',
        participants: 200,
        joined: false
    }
];

// User's campaigns
let myCampaigns = [];

// Function to render campaigns
function renderCampaigns() {
    const campaignsContainer = document.getElementById('campaignsContainer');
    campaignsContainer.innerHTML = '';

    campaigns.forEach(campaign => {
        if (!campaign.joined) {
            const card = createCampaignCard(campaign, 'join');
            campaignsContainer.appendChild(card);
        }
    });
}

// Function to render user's campaigns
function renderMyCampaigns() {
    const myCampaignsContainer = document.getElementById('myCampaignsContainer');
    myCampaignsContainer.innerHTML = '';

    if (myCampaigns.length === 0) {
        myCampaignsContainer.innerHTML = '<p>You have not joined any campaigns yet.</p>';
    } else {
        myCampaigns.forEach(campaign => {
            const card = createCampaignCard(campaign, 'leave');
            myCampaignsContainer.appendChild(card);
        });
    }
}

// Function to create a campaign card
function createCampaignCard(campaign, actionType) {
    const card = document.createElement('div');
    card.className = 'campaign-card';

    const title = document.createElement('h4');
    title.textContent = campaign.name;

    const description = document.createElement('p');
    description.textContent = campaign.description;

    const info = document.createElement('div');
    info.className = 'campaign-info';
    info.innerHTML = `
        Goal: ${campaign.goal}% &nbsp;|&nbsp;
        Duration: ${campaign.duration} days &nbsp;|&nbsp;
        Type: ${campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} &nbsp;|&nbsp;
        Participants: ${campaign.participants}
    `;

    const actionButton = document.createElement('button');
    actionButton.textContent = actionType === 'join' ? 'Join Campaign' : 'Leave Campaign';
    actionButton.addEventListener('click', () => {
        if (actionType === 'join') {
            joinCampaign(campaign.id);
        } else {
            leaveCampaign(campaign.id);
        }
    });

    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(info);
    card.appendChild(actionButton);

    return card;
}

// Function to join a campaign
function joinCampaign(campaignId) {
    const campaign = campaigns.find(c => c.id === campaignId);
    if (campaign) {
        campaign.joined = true;
        campaign.participants += 1;
        myCampaigns.push(campaign);
        renderCampaigns();
        renderMyCampaigns();
    }
}

// Function to leave a campaign
function leaveCampaign(campaignId) {
    const campaignIndex = myCampaigns.findIndex(c => c.id === campaignId);
    if (campaignIndex !== -1) {
        const campaign = myCampaigns[campaignIndex];
        campaign.joined = false;
        campaign.participants -= 1;
        myCampaigns.splice(campaignIndex, 1);
        renderCampaigns();
        renderMyCampaigns();
    }
}

// Modal functionality
const modal = document.getElementById('campaignModal');
const createCampaignBtn = document.getElementById('createCampaignBtn');
const closeModal = document.getElementById('closeModal');

// Open modal
createCampaignBtn.addEventListener('click', () => {
    modal.style.display = 'block';
});

// Close modal
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Close modal when clicking outside content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle campaign form submission
document.getElementById('campaignForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const campaignName = document.getElementById('campaignName').value.trim();
    const campaignDescription = document.getElementById('campaignDescription').value.trim();
    const campaignGoal = parseInt(document.getElementById('campaignGoal').value);
    const campaignDuration = parseInt(document.getElementById('campaignDuration').value);
    const campaignType = document.getElementById('campaignType').value;

    // Simple validation
    if (!campaignName || !campaignDescription || isNaN(campaignGoal) || isNaN(campaignDuration) || !campaignType) {
        alert('Please fill in all required fields.');
        return;
    }

    // Create new campaign (replace with actual API call)
    const newCampaign = {
        id: Date.now(),
        name: campaignName,
        description: campaignDescription,
        goal: campaignGoal,
        duration: campaignDuration,
        type: campaignType,
        participants: 1,
        joined: true
    };

    campaigns.push(newCampaign);
    myCampaigns.push(newCampaign);
    alert('Campaign created successfully!');
    document.getElementById('campaignForm').reset();
    modal.style.display = 'none';
    renderCampaigns();
    renderMyCampaigns();
});

// Initialize
renderCampaigns();
renderMyCampaigns();
