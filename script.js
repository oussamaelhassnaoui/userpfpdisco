// Theme Management
class ThemeManager {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update theme toggle button aria-label
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
            );
        }
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }
}

// Mobile Menu Management
class MobileMenuManager {
    constructor() {
        // Simplified since we removed navigation
        console.log('Mobile menu manager initialized (simplified)');
    }
}

// Search Functionality (Simplified for Discord-only)
class SearchManager {
    constructor() {
        // Simplified since we removed the general search
        console.log('Search manager initialized (simplified)');
    }
}

// Filter Management (Simplified for Discord-only)
class FilterManager {
    constructor() {
        // Simplified since we removed filters
        console.log('Filter manager initialized (simplified)');
    }
}

// Discord PFP Viewer
class DiscordPFPViewer {
    constructor() {
        console.log('Initializing DiscordPFPViewer');
        this.init();
    }

    init() {
        // Check if essential elements are found
        if (!this.downloadBtn || !this.bannerDownloadBtn || !this.bannerCardDownloadBtn) {
            console.log('Essential elements not found, waiting for DOM to be ready');
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    console.log('DOM loaded, reinitializing elements');
                    this.initializeElements();
                    this.bindEvents();
                });
            } else {
                // DOM is already ready, try again
                setTimeout(() => {
                    this.initializeElements();
                    this.bindEvents();
                }, 100);
            }
        } else {
            this.bindEvents();
        }
    }

    initializeElements() {
        this.userIdInput = document.getElementById('discord-user-id');
        this.searchBtn = document.getElementById('discord-search-btn');
        this.retryBtn = document.getElementById('discord-retry-btn');
        this.previewBtn = document.getElementById('discord-preview-btn');
        this.downloadBtn = document.getElementById('discord-download-btn');
        this.formatSelect = document.getElementById('avatar-format');
        this.bannerDownloadBtn = document.getElementById('discord-banner-download-btn');
        this.bannerDownloadSection = document.getElementById('banner-download-section');
        
        // New banner card elements
        this.bannerCardSection = document.getElementById('discord-banner-card-section');
        this.bannerCardImage = document.getElementById('discord-banner-card');
        this.bannerCardPreviewBtn = document.getElementById('discord-banner-card-preview-btn');
        this.bannerCardDownloadBtn = document.getElementById('discord-banner-card-download-btn');
        
        console.log('Elements found:', {
            userIdInput: !!this.userIdInput,
            searchBtn: !!this.searchBtn,
            retryBtn: !!this.retryBtn,
            previewBtn: !!this.previewBtn,
            downloadBtn: !!this.downloadBtn,
            formatSelect: !!this.formatSelect,
            bannerDownloadBtn: !!this.bannerDownloadBtn,
            bannerDownloadSection: !!this.bannerDownloadSection,
            bannerCardSection: !!this.bannerCardSection,
            bannerCardImage: !!this.bannerCardImage,
            bannerCardPreviewBtn: !!this.bannerCardPreviewBtn,
            bannerCardDownloadBtn: !!this.bannerCardDownloadBtn
        });
        
        // Log the actual elements for debugging
        console.log('Actual elements:', {
            downloadBtn: this.downloadBtn,
            bannerDownloadBtn: this.bannerDownloadBtn,
            bannerCardDownloadBtn: this.bannerCardDownloadBtn
        });
        
        // Check if buttons have the expected properties
        if (this.downloadBtn) {
            console.log('Download button properties:', {
                id: this.downloadBtn.id,
                className: this.downloadBtn.className,
                innerHTML: this.downloadBtn.innerHTML.substring(0, 50) + '...'
            });
        }
        
        if (this.bannerDownloadBtn) {
            console.log('Banner download button properties:', {
                id: this.bannerDownloadBtn.id,
                className: this.bannerDownloadBtn.className,
                innerHTML: this.bannerDownloadBtn.innerHTML.substring(0, 50) + '...'
            });
        }
        
        if (this.bannerCardDownloadBtn) {
            console.log('Banner card download button properties:', {
                id: this.bannerCardDownloadBtn.id,
                className: this.bannerCardDownloadBtn.className,
                innerHTML: this.bannerCardDownloadBtn.innerHTML.substring(0, 50) + '...'
            });
        }
        
        this.resultsContainer = document.getElementById('discord-results');
        this.loadingContainer = document.getElementById('discord-loading');
        this.errorContainer = document.getElementById('discord-error');
        
        this.avatar = document.getElementById('discord-avatar');
        this.username = document.getElementById('discord-username');
        this.userIdDisplay = document.getElementById('discord-user-id-display');
        this.userBadges = document.getElementById('discord-user-badges');
        this.creationDate = document.getElementById('discord-creation-date');
        this.errorMessage = document.getElementById('discord-error-message');
        this.helpToggle = document.getElementById('discord-help-toggle');
        this.helpSection = document.getElementById('discord-help-section');
        
        // Banner elements
        this.bannerSection = document.getElementById('discord-banner-section');
        this.bannerImage = document.getElementById('discord-banner');
        this.bannerPreviewBtn = document.getElementById('discord-banner-preview-btn');
        this.bannerPlaceholder = document.getElementById('discord-banner-placeholder');
        
        console.log('Banner elements found:', {
            bannerSection: !!this.bannerSection,
            bannerImage: !!this.bannerImage,
            bannerPreviewBtn: !!this.bannerPreviewBtn,
            bannerPlaceholder: !!this.bannerPlaceholder
        });
    }

    bindEvents() {
        console.log('Binding events for DiscordPFPViewer');
        
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.searchUser());
            console.log('Search button bound');
        }

        if (this.userIdInput) {
            this.userIdInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.searchUser();
                }
            });

            this.userIdInput.addEventListener('input', (e) => {
                this.validateInput(e.target.value);
                // Check if user entered letters and show help
                this.checkForLetters(e.target.value);
            });
            console.log('User ID input events bound');
        }

        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', () => this.searchUser());
            console.log('Retry button bound');
        }

        if (this.previewBtn) {
            this.previewBtn.addEventListener('click', () => this.previewAvatar());
            console.log('Preview button bound');
        }

        if (this.downloadBtn) {
            console.log('Found download button, attaching click event');
            // Remove any existing event listeners to prevent duplicates
            this.downloadBtn.removeEventListener('click', this._downloadAvatarHandler);
            // Create a new handler function
            this._downloadAvatarHandler = (e) => {
                console.log('Avatar download button clicked, event triggered');
                e.preventDefault();
                e.stopPropagation();
                this.downloadAvatar();
            };
            this.downloadBtn.addEventListener('click', this._downloadAvatarHandler);
            console.log('Avatar download button bound');
        } else {
            console.log('Download button not found in DOM');
        }

        // Banner download button
        if (this.bannerDownloadBtn) {
            console.log('Found banner download button, attaching click event');
            // Remove any existing event listeners to prevent duplicates
            this.bannerDownloadBtn.removeEventListener('click', this._downloadBannerHandler);
            // Create a new handler function
            this._downloadBannerHandler = (e) => {
                console.log('Banner download button clicked, event triggered');
                e.preventDefault();
                e.stopPropagation();
                this.downloadBanner();
            };
            this.bannerDownloadBtn.addEventListener('click', this._downloadBannerHandler);
            console.log('Banner download button bound');
        } else {
            console.log('Banner download button not found in DOM');
        }
        
        // Banner preview button
        if (this.bannerPreviewBtn) {
            this.bannerPreviewBtn.addEventListener('click', () => {
                console.log('Banner preview button clicked');
                this.previewBanner();
            });
            console.log('Banner preview button bound');
        }
        
        // Banner card preview button
        if (this.bannerCardPreviewBtn) {
            this.bannerCardPreviewBtn.addEventListener('click', () => {
                console.log('Banner card preview button clicked');
                this.previewBanner();
            });
            console.log('Banner card preview button bound');
        }
        
        // Banner card download button
        if (this.bannerCardDownloadBtn) {
            console.log('Found banner card download button, attaching click event');
            // Remove any existing event listeners to prevent duplicates
            this.bannerCardDownloadBtn.removeEventListener('click', this._downloadBannerCardHandler);
            // Create a new handler function
            this._downloadBannerCardHandler = (e) => {
                console.log('Banner card download button clicked, event triggered');
                e.preventDefault();
                e.stopPropagation();
                this.downloadBanner();
            };
            this.bannerCardDownloadBtn.addEventListener('click', this._downloadBannerCardHandler);
            console.log('Banner card download button bound');
        } else {
            console.log('Banner card download button not found in DOM');
        }

        // Update avatar when format changes
        if (this.formatSelect) {
            this.formatSelect.addEventListener('change', () => this.updateAvatarDisplay());
            console.log('Format select bound');
        }
        
        // Help toggle
        if (this.helpToggle) {
            this.helpToggle.addEventListener('click', () => this.toggleHelp());
            console.log('Help toggle bound');
        }
        
        // Example ID buttons
        const exampleBtns = document.querySelectorAll('.example-id-btn');
        exampleBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const userId = e.target.dataset.id;
                if (this.userIdInput && userId) {
                    this.userIdInput.value = userId;
                    this.validateInput(userId);
                    this.toggleHelp(); // Hide help after selecting
                }
            });
            console.log('Example ID button bound');
        });
        
        console.log('All events bound');
    }

    // New function to check for letters in input
    checkForLetters(value) {
        // If value contains letters and we haven't already triggered the help
        if (/[a-zA-Z]/.test(value) && !this.letterTriggered) {
            this.letterTriggered = true;
            this.showHelpWithMessage("It looks like you're entering a username. This tool requires a Discord User ID (17-19 digits). Here's how to find it:");
            
            // Add visual indicator to input field
            if (this.userIdInput) {
                this.userIdInput.classList.add('letter-input');
                setTimeout(() => {
                    this.userIdInput.classList.remove('letter-input');
                }, 2000);
            }
        }
        // Reset the flag when user clears the input or enters only numbers
        else if (!/[a-zA-Z]/.test(value)) {
            this.letterTriggered = false;
            // Remove visual indicator
            if (this.userIdInput) {
                this.userIdInput.classList.remove('letter-input');
            }
        }
    }

    // New function to show help with custom message
    showHelpWithMessage(message) {
        if (this.helpSection) {
            this.helpSection.style.display = 'block';
            
            // Add special class for letter-triggered help
            const helpCard = this.helpSection.querySelector('.help-card');
            if (helpCard) {
                helpCard.classList.add('letter-triggered');
                
                // Remove the class after animation completes
                setTimeout(() => {
                    helpCard.classList.remove('letter-triggered');
                }, 3000);
            }
            
            // Update help text if message provided
            const helpTextElement = this.helpSection.querySelector('.help-title');
            if (helpTextElement && message) {
                helpTextElement.textContent = message;
            }
            
            // Scroll to help section
            this.helpSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        if (this.helpToggle) {
            this.helpToggle.textContent = 'Hide help';
        }
    }

    validateInput(value) {
        const isValid = /^\d{17,19}$/.test(value.trim());
        if (this.userIdInput) {
            this.userIdInput.style.borderColor = value && !isValid ? 'var(--color-error)' : '';
        }
        if (this.searchBtn) {
            this.searchBtn.disabled = !isValid;
        }
        return isValid;
    }

    async searchUser() {
        const userId = this.userIdInput?.value.trim();
        
        // Check if the input contains letters (username instead of ID)
        if (userId && /[a-zA-Z]/.test(userId)) {
            this.showHelpWithMessage("It looks like you're entering a username. This tool requires a Discord User ID (17-19 digits). Here's how to find it:");
            // Show an error notification as well
            if (window.ErrorHandler) {
                ErrorHandler.showNotification('Please enter a Discord User ID (17-19 digits), not a username', 'error');
            }
            return;
        }
        
        if (!userId || !this.validateInput(userId)) {
            this.showError('Please enter a valid Discord User ID (17-19 digits)');
            return;
        }

        // Show loading animation on search button
        this.showSearchLoading();
        
        this.showLoading();
        
        try {
            // Since we can't make direct API calls to Discord from the browser due to CORS,
            // we'll use the public CDN endpoints to get avatar information
            const userData = await this.fetchUserData(userId);
            this.currentUserData = userData;
            this.showResults(userData);
        } catch (error) {
            console.error('Error fetching user data:', error);
            this.showError(error.message || 'Failed to fetch user data. Please check the User ID and try again.');
        } finally {
            // Hide loading animation on search button
            this.hideSearchLoading();
        }
    }

    showSearchLoading() {
        if (this.searchBtn) {
            // Store original content
            this.originalSearchBtnContent = this.searchBtn.innerHTML;
            
            // Show simple dot loading animation
            this.searchBtn.innerHTML = `
                Searching<span class="loading-dots"></span>
            `;
            this.searchBtn.disabled = true;
        }
    }

    hideSearchLoading() {
        if (this.searchBtn && this.originalSearchBtnContent) {
            this.searchBtn.innerHTML = this.originalSearchBtnContent;
            this.searchBtn.disabled = false;
        }
    }

    async fetchUserData(userId) {
        // Method 1: Try Discord's undocumented lookup endpoint
        try {
            const lookupUrl = `https://discordlookup.mesalytic.moe/v1/user/${userId}`;
            const response = await fetch(lookupUrl);
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.username) {
                    return {
                        id: data.id,
                        username: data.username || data.display_name || 'Unknown User',
                        globalName: data.global_name || data.display_name,
                        discriminator: data.discriminator || '0000',
                        avatar: data.avatar?.id,
                        banner: data.banner?.id,
                        accentColor: data.accent_color,
                        flags: data.flags || 0,
                        publicFlags: data.public_flags || 0,
                        hasAnimatedAvatar: data.avatar?.id ? data.avatar.id.startsWith('a_') : false,
                        hasAnimatedBanner: data.banner?.id ? data.banner.id.startsWith('a_') : false,
                        isBot: data.bot || false,
                        createdAt: data.created_at
                    };
                }
            }
        } catch (error) {
            console.log('Lookup service failed:', error.message);
        }
        
        // Method 2: Try another public API
        try {
            const altUrl = `https://japi.rest/discord/v1/user/${userId}`;
            const response = await fetch(altUrl);
            
            if (response.ok) {
                const data = await response.json();
                if (data.data) {
                    const userData = data.data;
                    return {
                        id: userData.id,
                        username: userData.username || userData.global_name || 'Unknown User',
                        globalName: userData.global_name,
                        discriminator: userData.discriminator || '0000',
                        avatar: userData.avatar,
                        banner: userData.banner,
                        accentColor: userData.accent_color,
                        flags: userData.flags || 0,
                        publicFlags: userData.public_flags || 0,
                        hasAnimatedAvatar: userData.avatar ? userData.avatar.startsWith('a_') : false,
                        hasAnimatedBanner: userData.banner ? userData.banner.startsWith('a_') : false,
                        isBot: userData.bot || false,
                        createdAt: userData.created_at
                    };
                }
            }
        } catch (error) {
            console.log('Alternative API failed, trying direct method');
        }
        
        // Method 3: Try direct Discord API with CORS proxy
        try {
            const proxyUrls = [
                'https://api.allorigins.win/raw?url=',
                'https://cors-anywhere.herokuapp.com/',
                'https://corsproxy.io/?'
            ];
            
            const discordApiUrl = `https://discord.com/api/v10/users/${userId}`;
            
            for (const proxy of proxyUrls) {
                try {
                    const response = await fetch(proxy + encodeURIComponent(discordApiUrl));
                    
                    if (response.ok) {
                        const userData = await response.json();
                        return {
                            id: userData.id,
                            username: userData.username,
                            globalName: userData.global_name,
                            discriminator: userData.discriminator || '0000',
                            avatar: userData.avatar,
                            banner: userData.banner,
                            accentColor: userData.accent_color,
                            flags: userData.flags || 0,
                            publicFlags: userData.public_flags || 0,
                            hasAnimatedAvatar: userData.avatar ? userData.avatar.startsWith('a_') : false,
                            hasAnimatedBanner: userData.banner ? userData.banner.startsWith('a_') : false,
                            isBot: userData.bot || false
                        };
                    }
                } catch (proxyError) {
                    console.log(`Proxy ${proxy} failed:`, proxyError.message);
                    continue;
                }
            }
        } catch (error) {
            console.log('All proxy methods failed');
        }
        
        // Method 4: Try to validate user existence using Snowflake timestamp
        try {
            const timestamp = this.getTimestampFromSnowflake(userId);
            const discordEpoch = new Date('2015-01-01T00:00:00.000Z');
            const userCreated = new Date(discordEpoch.getTime() + timestamp);
            
            // Check if timestamp is reasonable (after Discord was created)
            if (userCreated > discordEpoch && userCreated < new Date()) {
                // User ID format is valid, return default data
                const defaultAvatarId = parseInt(userId) % 5;
                return {
                    id: userId,
                    username: 'Unknown User',
                    globalName: null,
                    discriminator: '0000',
                    avatar: null,
                    banner: null,
                    accentColor: null,
                    flags: 0,
                    publicFlags: 0,
                    hasAnimatedAvatar: false,
                    hasAnimatedBanner: false,
                    isBot: false,
                    isDefault: true,
                    defaultAvatarId: defaultAvatarId,
                    createdAt: userCreated.toISOString()
                };
            }
        } catch (error) {
            // Snowflake parsing failed
        }
        
        throw new Error('Unable to fetch user data. The User ID may be invalid or the user does not exist.');
    }
    
    getTimestampFromSnowflake(snowflake) {
        // Extract timestamp from Discord snowflake ID
        return parseInt(snowflake) >> 22;
    }

    testImageLoad(url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => reject(new Error('Image load failed'));
            img.src = url;
        });
    }

    getAvatarUrl(userData, size = 4096, format = 'png') {
        const baseUrl = 'https://cdn.discordapp.com';
        
        if (userData.avatar) {
            // User has custom avatar - use highest quality
            const extension = userData.hasAnimatedAvatar && format === 'gif' ? 'gif' : format;
            const url = `${baseUrl}/avatars/${userData.id}/${userData.avatar}.${extension}?size=${size}`;
            console.log('Generated avatar URL:', url);
            return url;
        } else {
            // Use default avatar - Discord's default avatars are limited to 1024x1024
            let defaultAvatarId;
            if (userData.isDefault && userData.defaultAvatarId !== undefined) {
                defaultAvatarId = userData.defaultAvatarId;
            } else {
                // Calculate default avatar ID from User ID
                if (userData.discriminator && userData.discriminator !== '0000') {
                    // Old discriminator system
                    defaultAvatarId = parseInt(userData.discriminator) % 5;
                } else {
                    // New username system
                    defaultAvatarId = parseInt(userData.id) % 5;
                }
            }
            // Default avatars max out at 1024x1024
            const maxSize = Math.min(size, 1024);
            const url = `${baseUrl}/embed/avatars/${defaultAvatarId}.png?size=${maxSize}`;
            console.log('Generated default avatar URL:', url);
            return url;
        }
    }
    
    getBannerUrl(userData, size = 1024, format = 'png') {
        const baseUrl = 'https://cdn.discordapp.com';
        
        if (userData.banner) {
            const extension = userData.hasAnimatedBanner && format === 'gif' ? 'gif' : format;
            // Add timestamp to avoid caching issues
            const timestamp = new Date().getTime();
            const url = `${baseUrl}/banners/${userData.id}/${userData.banner}.${extension}?size=${size}&t=${timestamp}`;
            console.log('Generated banner URL:', url);
            return url;
        }
        console.log('No banner available');
        return null;
    }

    showLoading() {
        this.hideAllStates();
        if (this.loadingContainer) {
            this.loadingContainer.style.display = 'block';
        }
        if (this.searchBtn) {
            this.searchBtn.disabled = true;
        }
    }

    showResults(userData) {
        this.hideAllStates();
        if (this.resultsContainer) {
            this.resultsContainer.style.display = 'block';
        }
        if (this.searchBtn) {
            this.searchBtn.disabled = false;
        }
        
        // Enable banner download button if there's a banner
        if (this.bannerDownloadBtn && userData.banner) {
            this.bannerDownloadBtn.disabled = false;
        }
        
        this.populateUserData(userData);
    }

    showError(message) {
        this.hideAllStates();
        if (this.errorContainer) {
            this.errorContainer.style.display = 'block';
        }
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
        }
        if (this.searchBtn) {
            this.searchBtn.disabled = false;
        }
    }

    hideAllStates() {
        const containers = [this.resultsContainer, this.loadingContainer, this.errorContainer];
        containers.forEach(container => {
            if (container) {
                container.style.display = 'none';
            }
        });
    }

    populateUserData(userData) {
        // Update username display
        if (this.username) {
            const displayName = userData.globalName || userData.username || 'Unknown User';
            this.username.textContent = displayName;
        }
        
        // Update user ID display
        if (this.userIdDisplay) {
            this.userIdDisplay.textContent = `ID: ${userData.id}`;
        }
        
        // Update creation date
        if (this.creationDate && userData.createdAt) {
            const createdDate = new Date(userData.createdAt);
            this.creationDate.textContent = `Created: ${createdDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}`;
        } else if (this.creationDate) {
            // Calculate from snowflake ID
            try {
                const timestamp = this.getTimestampFromSnowflake(userData.id);
                const discordEpoch = new Date('2015-01-01T00:00:00.000Z');
                const userCreated = new Date(discordEpoch.getTime() + timestamp);
                this.creationDate.textContent = `Created: ${userCreated.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}`;
            } catch (e) {
                this.creationDate.textContent = '';
            }
        }
        
        // Update badges
        if (this.userBadges) {
            this.userBadges.innerHTML = '';
            
            if (userData.isBot) {
                const botBadge = document.createElement('span');
                botBadge.className = 'discord-badge';
                botBadge.textContent = 'BOT';
                botBadge.style.backgroundColor = '#5865f2';
                this.userBadges.appendChild(botBadge);
            }
            
            if (userData.hasAnimatedAvatar) {
                const animatedBadge = document.createElement('span');
                animatedBadge.className = 'discord-badge';
                animatedBadge.textContent = 'ANIMATED';
                animatedBadge.style.backgroundColor = '#f59e0b';
                this.userBadges.appendChild(animatedBadge);
            }
            
            if (userData.flags && userData.flags > 0) {
                const flagsBadge = document.createElement('span');
                flagsBadge.className = 'discord-badge';
                flagsBadge.textContent = 'VERIFIED';
                flagsBadge.style.backgroundColor = '#10b981';
                this.userBadges.appendChild(flagsBadge);
            }
            
            if (userData.isDefault) {
                const defaultBadge = document.createElement('span');
                defaultBadge.className = 'discord-badge';
                defaultBadge.textContent = 'DEFAULT AVATAR';
                defaultBadge.style.backgroundColor = '#6b7280';
                this.userBadges.appendChild(defaultBadge);
            }
        }
        
        // Enable GIF format only for animated avatars
        if (this.formatSelect) {
            const gifOption = this.formatSelect.querySelector('option[value="gif"]');
            if (gifOption) {
                if (userData.hasAnimatedAvatar) {
                    gifOption.style.display = 'block';
                    gifOption.textContent = 'GIF (Animated)';
                } else {
                    gifOption.style.display = 'none';
                }
            }
        }
        
        // Handle banner display
        if (this.bannerDownloadSection) {
            if (userData.banner) {
                this.bannerDownloadSection.style.display = 'block';
                // Enable the download button
                if (this.bannerDownloadBtn) {
                    this.bannerDownloadBtn.disabled = false;
                }
            } else {
                this.bannerDownloadSection.style.display = 'none';
                // Disable the download button
                if (this.bannerDownloadBtn) {
                    this.bannerDownloadBtn.disabled = true;
                }
            }
        }
        
        // Handle banner card display
        if (this.bannerCardSection) {
            if (userData.banner) {
                this.bannerCardSection.style.display = 'block';
                // Enable the download button
                if (this.bannerCardDownloadBtn) {
                    this.bannerCardDownloadBtn.disabled = false;
                }
                
                // Set banner card image
                const bannerUrl = this.getBannerUrl(userData, 512, 'png');
                if (this.bannerCardImage) {
                    this.bannerCardImage.src = bannerUrl;
                    this.bannerCardImage.alt = `${userData.username || 'User'}'s Discord Banner`;
                    
                    // Add error handling for banner card image
                    this.bannerCardImage.onerror = () => {
                        console.error('Failed to load banner card image:', bannerUrl);
                        this.bannerCardSection.style.display = 'none';
                    };
                }
            } else {
                this.bannerCardSection.style.display = 'none';
                // Disable the download button
                if (this.bannerCardDownloadBtn) {
                    this.bannerCardDownloadBtn.disabled = true;
                }
            }
        }
        
        // Log banner data for debugging
        console.log('User data banner info:', {
            hasBanner: !!userData.banner,
            bannerId: userData.banner,
            hasAnimatedBanner: userData.hasAnimatedBanner
        });
        
        // Handle banner section display
        if (this.bannerSection) {
            console.log('Updating banner section, has banner:', !!userData.banner);
            if (userData.banner) {
                this.bannerSection.style.display = 'block';
                console.log('Banner section displayed');
                
                // Show placeholder while loading
                if (this.bannerPlaceholder) {
                    this.bannerPlaceholder.style.display = 'block';
                }
                if (this.bannerImage) {
                    this.bannerImage.style.display = 'none';
                }
                
                // Set banner image
                const bannerUrl = this.getBannerUrl(userData, 512, 'png');
                console.log('Banner URL:', bannerUrl);
                
                if (this.bannerImage) {
                    // Add timestamp to avoid caching issues
                    const urlWithTimestamp = `${bannerUrl}&t=${new Date().getTime()}`;
                    this.bannerImage.src = urlWithTimestamp;
                    this.bannerImage.alt = `${userData.username || 'User'}'s Discord Banner`;
                    
                    // Add error handling for banner image
                    this.bannerImage.onerror = () => {
                        console.error('Failed to load banner image:', bannerUrl);
                        // Hide placeholder and image if image fails to load
                        if (this.bannerPlaceholder) {
                            this.bannerPlaceholder.style.display = 'none';
                        }
                        this.bannerImage.style.display = 'none';
                    };
                    
                    this.bannerImage.onload = () => {
                        console.log('Banner image loaded successfully');
                        // Hide placeholder and show image
                        if (this.bannerPlaceholder) {
                            this.bannerPlaceholder.style.display = 'none';
                        }
                        this.bannerImage.style.display = 'block';
                    };
                }
            } else {
                console.log('No banner, hiding banner section');
                this.bannerSection.style.display = 'none';
            }
        }
        
        this.updateAvatarDisplay();
    }
    
    getTimestampFromSnowflake(snowflake) {
        // Extract timestamp from Discord snowflake ID
        return parseInt(snowflake) >> 22;
    }
    
    previewBanner() {
        console.log('Preview banner called');
        if (!this.currentUserData || !this.currentUserData.banner) {
            console.log('No banner data to preview');
            return;
        }
        
        const bannerUrl = this.getBannerUrl(this.currentUserData, 1024, 'png');
        
        const imageData = {
            url: bannerUrl,
            title: `${this.currentUserData.username || 'User'}'s Discord Banner`,
            category: 'Discord Profile Banner'
        };
        
        if (window.modalManager) {
            window.modalManager.openModal(imageData);
        }
    }
    
    async downloadBanner() {
        try {
            console.log('Banner download initiated');
            if (!this.currentUserData || !this.currentUserData.banner) {
                console.log('No banner data available');
                if (window.ErrorHandler) {
                    ErrorHandler.showNotification('No banner available for this user', 'error');
                }
                return;
            }
            
            const bannerUrl = this.getBannerUrl(this.currentUserData, 1024, 'png');
            console.log('Banner URL:', bannerUrl);
            
            // Check if URL is valid
            if (!bannerUrl) {
                console.error('Invalid banner URL');
                if (window.ErrorHandler) {
                    ErrorHandler.showNotification('Unable to generate download URL', 'error');
                }
                return;
            }
            
            // Show loading state with dot animation
            const originalBtnContent = this.bannerDownloadBtn.innerHTML;
            this.bannerDownloadBtn.disabled = true;
            this.bannerDownloadBtn.innerHTML = 'Downloading<span class="loading-dots"></span>';
            
            // Also update the banner card download button if it exists
            if (this.bannerCardDownloadBtn) {
                this.bannerCardDownloadBtn.disabled = true;
                this.bannerCardDownloadBtn.innerHTML = 'Downloading<span class="loading-dots"></span>';
            }
            
            // Create download link and trigger download
            const filename = `discord-banner-${this.currentUserData.id}-1024x1024.png`;
            // Use improved download method that handles Discord CDN properly
            this.triggerDownload(bannerUrl, filename);
            
            // Show success notification
            if (window.ErrorHandler) {
                ErrorHandler.showNotification('Banner download started!', 'success');
            }
        } catch (error) {
            console.error('Banner download failed:', error);
            if (window.ErrorHandler) {
                ErrorHandler.showNotification(`Failed to download banner: ${error.message}`, 'error');
            }
        } finally {
            // Restore button state after a short delay
            setTimeout(() => {
                this.bannerDownloadBtn.disabled = false;
                this.bannerDownloadBtn.innerHTML = `
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Download Banner
                `;
                
                // Also restore the banner card download button if it exists
                if (this.bannerCardDownloadBtn) {
                    this.bannerCardDownloadBtn.disabled = false;
                    this.bannerCardDownloadBtn.innerHTML = `
                        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Download Banner
                    `;
                }
            }, 1000);
        }
    }
    
    toggleHelp() {
        if (this.helpSection) {
            const isVisible = this.helpSection.style.display !== 'none';
            this.helpSection.style.display = isVisible ? 'none' : 'block';
            
            if (this.helpToggle) {
                this.helpToggle.textContent = isVisible ? 'Need help finding User ID?' : 'Hide help';
            }
            
            // Reset letter triggered flag when manually toggling
            if (!isVisible) {
                this.letterTriggered = false;
            }
        }
    }

    updateAvatarDisplay() {
        if (!this.currentUserData || !this.avatar) return;
        
        const format = this.formatSelect?.value || 'png';
        
        // Don't allow GIF format for non-animated avatars
        const actualFormat = (format === 'gif' && !this.currentUserData.hasAnimatedAvatar) ? 'png' : format;
        
        // Use display size for preview, but download will use highest quality
        const displaySize = 128;
        const avatarUrl = this.getAvatarUrl(this.currentUserData, displaySize, actualFormat);
        this.avatar.src = avatarUrl;
        this.avatar.alt = `${this.currentUserData.username || 'User'}'s Discord Avatar`;
        
        // Handle image load errors
        this.avatar.onerror = () => {
            // Fallback to default avatar if custom avatar fails
            const defaultAvatarId = this.currentUserData.defaultAvatarId || (parseInt(this.currentUserData.id) % 5);
            this.avatar.src = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarId}.png?size=${displaySize}`;
            
            // Show notification
            if (window.ErrorHandler) {
                ErrorHandler.showNotification('Avatar failed to load, showing default avatar', 'warning');
            }
        };
        
        // Handle successful load
        this.avatar.onload = () => {
            // Show success notification for actual profile pictures
            if (this.currentUserData.avatar && !this.currentUserData.isDefault) {
                if (window.ErrorHandler) {
                    ErrorHandler.showNotification('Profile picture loaded successfully!', 'success');
                }
            }
        };
    }

    previewAvatar() {
        if (!this.currentUserData) return;
        
        const format = this.formatSelect?.value || 'png';
        const avatarUrl = this.getAvatarUrl(this.currentUserData, 1024, format);
        
        const imageData = {
            url: avatarUrl,
            title: `${this.currentUserData.username || 'User'}'s Discord Avatar`,
            category: 'Discord Profile Picture'
        };
        
        if (window.modalManager) {
            window.modalManager.openModal(imageData);
        }
    }

    async downloadAvatar() {
        try {
            console.log('Avatar download initiated');
            if (!this.currentUserData) {
                console.log('No user data available');
                if (window.ErrorHandler) {
                    ErrorHandler.showNotification('No user data available. Please search for a user first.', 'error');
                }
                return;
            }
            
            const format = this.formatSelect?.value || 'png';
            // Always download at highest quality (4096 for custom avatars, 1024 for default)
            const size = this.currentUserData.avatar ? 4096 : 1024;
            const avatarUrl = this.getAvatarUrl(this.currentUserData, size, format);
            console.log('Avatar URL:', avatarUrl);
            
            // Check if URL is valid
            if (!avatarUrl) {
                console.error('Invalid avatar URL');
                if (window.ErrorHandler) {
                    ErrorHandler.showNotification('Unable to generate download URL', 'error');
                }
                return;
            }
            
            // Show loading state with dot animation
            const originalBtnContent = this.downloadBtn.innerHTML;
            this.downloadBtn.disabled = true;
            this.downloadBtn.innerHTML = 'Downloading<span class="loading-dots"></span>';
            
            // Create download link and trigger download
            const filename = `discord-avatar-${this.currentUserData.id}-${size}x${size}.${format}`;
            console.log('Attempting to download with filename:', filename);
            
            // Use improved download method that handles Discord CDN properly
            const downloadSuccess = this.triggerDownload(avatarUrl, filename);
            
            // Show success notification
            if (window.ErrorHandler) {
                if (downloadSuccess) {
                    ErrorHandler.showNotification(`Avatar download started!`, 'success');
                } else {
                    ErrorHandler.showNotification('Download may have opened in a new tab', 'warning');
                }
            }
            
        } catch (error) {
            console.error('Download failed:', error);
            if (window.ErrorHandler) {
                ErrorHandler.showNotification('Failed to download avatar. Please try again.', 'error');
            }
        } finally {
            // Restore button state after a short delay
            setTimeout(() => {
                this.downloadBtn.disabled = false;
                this.downloadBtn.innerHTML = `
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Download Profile Picture
                `;
            }, 1000);
        }
    }

    // Add the missing triggerDownload method
    triggerDownload(url, filename) {
        try {
            console.log('Attempting to download:', { url, filename });
            
            // For Discord CDN URLs, we need to use a technique that works with their CDN
            if (url.includes('cdn.discordapp.com')) {
                // Try to fetch the image as a blob and create a download link
                // This approach works even with CORS restrictions in many cases
                fetch(url)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.blob();
                    })
                    .then(blob => {
                        // Create a local object URL for the blob
                        const blobUrl = URL.createObjectURL(blob);
                        
                        // Create a temporary anchor element for the blob
                        const blobLink = document.createElement('a');
                        blobLink.href = blobUrl;
                        blobLink.download = filename || 'discord-image.png';
                        
                        // Trigger the download
                        document.body.appendChild(blobLink);
                        blobLink.click();
                        document.body.removeChild(blobLink);
                        
                        // Clean up the object URL
                        URL.revokeObjectURL(blobUrl);
                        
                        console.log('Download completed for Discord CDN:', filename);
                        
                        // Show success notification
                        if (window.ErrorHandler) {
                            ErrorHandler.showNotification('Download completed successfully!', 'success');
                        }
                    })
                    .catch(error => {
                        console.error('Failed to download from Discord CDN as blob:', error);
                        // Fallback: Try a different approach with modified URL
                        const modifiedUrl = url + (url.includes('?') ? '&' : '?') + 'download=true';
                        
                        const a = document.createElement('a');
                        a.href = modifiedUrl;
                        a.target = '_blank';
                        a.rel = 'noopener noreferrer';
                        
                        // Show notification to user with clear instructions
                        if (window.ErrorHandler) {
                            ErrorHandler.showNotification('Image opened in new tab. Use Ctrl+S or right-click to save.', 'info');
                        }
                        
                        // Trigger the action
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    });
                
                return true;
            } else {
                // For non-Discord URLs, use the standard download approach
                const a = document.createElement('a');
                a.href = url;
                a.download = filename || 'discord-image.png';
                a.target = '_blank';
                
                // Log the anchor element for debugging
                console.log('Anchor element created:', a);
                
                // Append to body, click, and remove
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                
                console.log('Download triggered successfully:', filename);
                return true;
            }
        } catch (error) {
            console.error('Failed to trigger download:', error);
            // Final fallback
            try {
                window.open(url, '_blank');
                if (window.ErrorHandler) {
                    ErrorHandler.showNotification('Image opened in new tab. Use Ctrl+S or right-click to save.', 'info');
                }
                return false;
            } catch (fallbackError) {
                console.error('All download methods failed:', fallbackError);
                if (window.ErrorHandler) {
                    ErrorHandler.showNotification('Unable to process download. Please try again.', 'error');
                }
                return false;
            }
        }
    }

    // Test function to verify download mechanism
    testDownload() {
        console.log('Test download function called');
        try {
            const testUrl = 'https://cdn.discordapp.com/avatars/882322615346270268/6c99373db632091475504efd1681192d.png?size=4096';
            const filename = 'test-avatar.png';
            console.log('Testing download with URL:', testUrl);
            const success = this.triggerDownload(testUrl, filename);
            console.log('Test download result:', success);
        } catch (error) {
            console.error('Test download failed:', error);
        }
    }

    // Test function to verify banner download mechanism
    testBannerDownload() {
        console.log('Test banner download function called');
        try {
            // Using a sample banner URL for testing
            const testBannerUrl = 'https://cdn.discordapp.com/banners/882322615346270268/sample-banner.png?size=1024';
            const filename = 'test-banner.png';
            console.log('Testing banner download with URL:', testBannerUrl);
            const success = this.triggerDownload(testBannerUrl, filename);
            console.log('Test banner download result:', success);
        } catch (error) {
            console.error('Test banner download failed:', error);
        }
    }

    // Manual rebind for debugging
    rebindEvents() {
        console.log('Manually rebinding events');
        this.initializeElements();
        this.bindEvents();
    }
}

// Modal Management
class ModalManager {
    constructor() {
        this.modal = document.getElementById('image-modal');
        this.modalOverlay = document.getElementById('modal-overlay');
        this.modalClose = document.getElementById('modal-close');
        this.modalImage = document.getElementById('modal-image');
        this.modalTitle = document.getElementById('modal-image-title');
        this.modalCategory = document.getElementById('modal-image-category');
        this.downloadBtn = document.getElementById('download-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.currentImageData = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Close modal events
        if (this.modalClose) {
            this.modalClose.addEventListener('click', () => this.closeModal());
        }

        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', () => this.closeModal());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.modal && this.modal.classList.contains('show')) {
                if (e.key === 'Escape') {
                    this.closeModal();
                }
            }
        });

        // Download button
        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadImage());
        }

        // Share button
        if (this.shareBtn) {
            this.shareBtn.addEventListener('click', () => this.shareImage());
        }
    }

    openModal(imageData) {
        this.currentImageData = imageData;
        
        if (this.modal && this.modalImage && this.modalTitle && this.modalCategory) {
            this.modalImage.src = imageData.url;
            this.modalImage.alt = imageData.title;
            this.modalTitle.textContent = imageData.title;
            this.modalCategory.textContent = imageData.category;
            
            this.modal.classList.add('show');
            this.modal.setAttribute('aria-hidden', 'false');
            
            // Focus management
            this.modalClose?.focus();
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
            this.modal.setAttribute('aria-hidden', 'true');
            
            // Restore body scroll
            document.body.style.overflow = '';
            
            // Return focus to the element that opened the modal
            const activeElement = document.querySelector('.gallery-item.focus');
            if (activeElement) {
                activeElement.focus();
                activeElement.classList.remove('focus');
            }
        }
    }

    async downloadImage() {
        if (!this.currentImageData) return;

        try {
            // Generate a proper filename
            let filename = this.currentImageData.title || 'discord-image';
            const extension = this.getImageExtension(this.currentImageData.url);
            filename = `${filename}.${extension}`;
            
            // Use the same triggerDownload method as the discord-download-btn for consistency
            const downloadSuccess = window.discordPFPViewer.triggerDownload(this.currentImageData.url, filename);
            
            // Show success notification
            if (window.ErrorHandler) {
                if (downloadSuccess) {
                    ErrorHandler.showNotification(`Download started!`, 'success');
                } else {
                    ErrorHandler.showNotification('Download may have opened in a new tab', 'warning');
                }
            }
            
            console.log('Download triggered for modal image:', this.currentImageData.title);
        } catch (error) {
            console.error('Download failed:', error);
            if (window.ErrorHandler) {
                ErrorHandler.showNotification('Failed to download image. Please try again.', 'error');
            }
        }
    }

    async shareImage() {
        if (!this.currentImageData) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.currentImageData.title,
                    text: `Check out this awesome profile picture: ${this.currentImageData.title}`,
                    url: window.location.href
                });
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        } else {
            // Fallback: copy URL to clipboard
            try {
                await navigator.clipboard.writeText(window.location.href);
                alert('URL copied to clipboard!');
            } catch (error) {
                console.error('Failed to copy URL:', error);
                alert('Failed to share. Please copy the URL manually.');
            }
        }
    }

    getImageExtension(url) {
        const extension = url.split('.').pop().toLowerCase();
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension) ? extension : 'jpg';
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(new Date(date));
    }

    static slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }

    static getRandomId() {
        return Math.random().toString(36).substr(2, 9);
    }

    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    static smoothScrollTo(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// Error Handling
class ErrorHandler {
    static log(error, context = '') {
        console.error(`Error ${context ? `in ${context}` : ''}:`, error);
    }

    static handleImageError(img, fallbackUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDI0MCAyNDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik0xMjAgODBDMTA0IDgwIDkwIDk0IDkwIDExMFYxMzBDOTAgMTQ2IDEwNCAxNjAgMTIwIDE2MEMxMzYgMTYwIDE1MCAxNDYgMTUwIDEzMFYxMTBDMTUwIDk0IDEzNiA4MCAxMjAgODBaIiBmaWxsPSIjNjQ3NDhCIi8+CjxjaXJjbGUgY3g9IjEyMCIgY3k9IjEyMCIgcj0iNDAiIGZpbGw9IiM5NEEzQjgiLz4KPC9zdmc+') {
        img.src = fallbackUrl;
        img.alt = 'Image not available';
    }

    static showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.id = 'custom-notification';
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 20px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateY(-20px)',
            transition: 'all 0.4s ease',
            backgroundColor: type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            maxWidth: '400px',
            textAlign: 'center'
        });

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 4000);
    }
}

// Initialize App
class App {
    constructor() {
        this.themeManager = null;
        this.mobileMenuManager = null;
        this.searchManager = null;
        this.filterManager = null;
        this.modalManager = null;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
            console.log('DOM not ready, waiting for DOMContentLoaded');
        } else {
            console.log('DOM already ready, initializing components');
            this.initializeComponents();
        }
    }

    initializeComponents() {
        console.log('Initializing components');
        try {
            // Initialize core components
            this.themeManager = new ThemeManager();
            this.mobileMenuManager = new MobileMenuManager();
            this.searchManager = new SearchManager();
            this.filterManager = new FilterManager();
            this.modalManager = new ModalManager();
            this.discordPFPViewer = new DiscordPFPViewer();

            // Make managers globally available
            window.themeManager = this.themeManager;
            window.mobileMenuManager = this.mobileMenuManager;
            window.searchManager = this.searchManager;
            window.filterManager = this.filterManager;
            window.modalManager = this.modalManager;
            window.discordPFPViewer = this.discordPFPViewer;

            console.log('PFP Gallery app initialized successfully');
        } catch (error) {
            ErrorHandler.log(error, 'App initialization');
        }
    }
}

// Make the download functions globally accessible for testing
window.testAvatarDownload = function() {
    console.log('Testing avatar download function');
    if (window.discordPFPViewer) {
        // Create mock user data for testing
        const mockUserData = {
            id: '123456789012345678',
            username: 'TestUser',
            avatar: 'abcdef1234567890',
            hasAnimatedAvatar: false
        };
        window.discordPFPViewer.currentUserData = mockUserData;
        window.discordPFPViewer.downloadAvatar();
    } else {
        console.log('DiscordPFPViewer not available');
    }
};

window.testBannerDownload = function() {
    console.log('Testing banner download function');
    if (window.discordPFPViewer) {
        // Create mock user data for testing
        const mockUserData = {
            id: '123456789012345678',
            username: 'TestUser',
            banner: 'abcdef1234567890',
            hasAnimatedBanner: false
        };
        window.discordPFPViewer.currentUserData = mockUserData;
        window.discordPFPViewer.downloadBanner();
    } else {
        console.log('DiscordPFPViewer not available');
    }
};

// Simple test function for banner download with a real URL
window.testBannerDownloadDirect = function() {
    console.log('Testing direct banner download function');
    if (window.discordPFPViewer) {
        // Test with a sample banner URL
        const testBannerUrl = 'https://cdn.discordapp.com/banners/882322615346270268/sample-banner.png?size=1024';
        window.discordPFPViewer.triggerDownload(testBannerUrl, 'test-banner.png');
    } else {
        console.log('DiscordPFPViewer not available');
    }
};

window.rebindDiscordEvents = function() {
    console.log('Rebinding Discord events');
    if (window.discordPFPViewer) {
        window.discordPFPViewer.bindEvents();
    } else {
        console.log('DiscordPFPViewer not available');
    }
};

window.checkDiscordButtons = function() {
    console.log('Checking Discord buttons in DOM:');
    const downloadBtn = document.getElementById('discord-download-btn');
    const bannerDownloadBtn = document.getElementById('discord-banner-download-btn');
    
    console.log('Avatar download button:', downloadBtn);
    console.log('Banner download button:', bannerDownloadBtn);
    
    if (downloadBtn) {
        console.log('Avatar download button properties:', {
            id: downloadBtn.id,
            className: downloadBtn.className,
            innerHTML: downloadBtn.innerHTML.substring(0, 100) + '...'
        });
    }
    
    if (bannerDownloadBtn) {
        console.log('Banner download button properties:', {
            id: bannerDownloadBtn.id,
            className: bannerDownloadBtn.className,
            innerHTML: bannerDownloadBtn.innerHTML.substring(0, 100) + '...'
        });
    }
    
    return { downloadBtn, bannerDownloadBtn };
};

// Start the application
console.log('Starting app');
const app = new App();

// Language detection and redirection
(function() {
    // Function to detect user's preferred language
    function detectLanguage() {
        // Check if user has already selected a language
        const savedLanguage = localStorage.getItem('preferredLanguage');
        if (savedLanguage) {
            return savedLanguage;
        }
        
        // Get browser's preferred languages
        const browserLanguages = navigator.languages || [navigator.language || navigator.userLanguage];
        
        // Check for supported languages in order of preference
        for (let lang of browserLanguages) {
            // Handle language codes like "en-US", "fr-FR", etc.
            const primaryLang = lang.split('-')[0].toLowerCase();
            
            // Supported languages
            const supportedLanguages = {
                'en': 'en',
                'fr': 'fr',
                'de': 'de',
                'es': 'es',
                'ar': 'ar'
            };
            
            if (supportedLanguages[primaryLang]) {
                return supportedLanguages[primaryLang];
            }
        }
        
        // Default to English if no supported language is found
        return 'en';
    }
    
    // Function to redirect to the appropriate language page
    function redirectToLanguagePage() {
        const currentPath = window.location.pathname;
        const detectedLanguage = detectLanguage();
        
        // If we're on the main page and the detected language is not English
        if ((currentPath === '/' || currentPath === '/discord-pfp-viewer.html') && detectedLanguage !== 'en') {
            const languagePages = {
                'fr': '/index-fr.html',
                'de': '/index-de.html',
                'es': '/index-es.html',
                'ar': '/index-ar.html'
            };
            
            if (languagePages[detectedLanguage]) {
                // Save the preferred language
                localStorage.setItem('preferredLanguage', detectedLanguage);
                
                // Redirect to the language-specific page
                window.location.href = languagePages[detectedLanguage];
            }
        }
    }
    
    // Run the language detection on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', redirectToLanguagePage);
    } else {
        redirectToLanguagePage();
    }
})();

// Language selector functionality
(function() {
    function initLanguageSelector() {
        const languageSelector = document.getElementById('language-selector');
        if (!languageSelector) return;
        
        // Set the selected language based on current page
        const currentPath = window.location.pathname;
        if (currentPath.includes('index-fr.html')) {
            languageSelector.value = 'fr';
        } else if (currentPath.includes('index-de.html')) {
            languageSelector.value = 'de';
        } else if (currentPath.includes('index-es.html')) {
            languageSelector.value = 'es';
        } else if (currentPath.includes('index-ar.html')) {
            languageSelector.value = 'ar';
        } else {
            languageSelector.value = 'en';
        }
        
        // Handle language change
        languageSelector.addEventListener('change', function() {
            const selectedLanguage = this.value;
            const languagePages = {
                'en': '/',
                'fr': '/index-fr.html',
                'de': '/index-de.html',
                'es': '/index-es.html',
                'ar': '/index-ar.html'
            };
            
            if (languagePages[selectedLanguage]) {
                // Save the preferred language
                localStorage.setItem('preferredLanguage', selectedLanguage);
                
                // Redirect to the language-specific page
                window.location.href = languagePages[selectedLanguage];
            }
        });
    }
    
    // Initialize language selector when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLanguageSelector);
    } else {
        initLanguageSelector();
    }
})();
