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
        this.userIdInput = document.getElementById('discord-user-id');
        this.searchBtn = document.getElementById('discord-search-btn');
        this.retryBtn = document.getElementById('discord-retry-btn');
        this.previewBtn = document.getElementById('discord-preview-btn');
        this.downloadBtn = document.getElementById('discord-download-btn');
        this.formatSelect = document.getElementById('avatar-format');
        this.bannerDownloadBtn = document.getElementById('discord-banner-download-btn');
        this.bannerDownloadSection = document.getElementById('banner-download-section');
        
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
        
        this.currentUserData = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        if (this.searchBtn) {
            this.searchBtn.addEventListener('click', () => this.searchUser());
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
            });
        }

        if (this.retryBtn) {
            this.retryBtn.addEventListener('click', () => this.searchUser());
        }

        if (this.previewBtn) {
            this.previewBtn.addEventListener('click', () => this.previewAvatar());
        }

        if (this.downloadBtn) {
            this.downloadBtn.addEventListener('click', () => this.downloadAvatar());
        }

        // Banner download button
        if (this.bannerDownloadBtn) {
            this.bannerDownloadBtn.addEventListener('click', () => this.downloadBanner());
        }

        // Update avatar when format changes
        if (this.formatSelect) {
            this.formatSelect.addEventListener('change', () => this.updateAvatarDisplay());
        }
        
        // Help toggle
        if (this.helpToggle) {
            this.helpToggle.addEventListener('click', () => this.toggleHelp());
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
        });
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
        if (!userId || !this.validateInput(userId)) {
            this.showError('Please enter a valid Discord User ID (17-19 digits)');
            return;
        }

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
            return `${baseUrl}/avatars/${userData.id}/${userData.avatar}.${extension}?size=${size}`;
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
            return `${baseUrl}/embed/avatars/${defaultAvatarId}.png?size=${maxSize}`;
        }
    }
    
    getBannerUrl(userData, size = 1024, format = 'png') {
        const baseUrl = 'https://cdn.discordapp.com';
        
        if (userData.banner) {
            const extension = userData.hasAnimatedBanner && format === 'gif' ? 'gif' : format;
            return `${baseUrl}/banners/${userData.id}/${userData.banner}.${extension}?size=${size}`;
        }
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
            } else {
                this.bannerDownloadSection.style.display = 'none';
            }
        }
        
        this.updateAvatarDisplay();
    }
    
    getTimestampFromSnowflake(snowflake) {
        // Extract timestamp from Discord snowflake ID
        return parseInt(snowflake) >> 22;
    }
    
    async downloadBanner() {
        if (!this.currentUserData || !this.currentUserData.banner) return;
        
        const bannerUrl = this.getBannerUrl(this.currentUserData, 1024, 'png');
        
        try {
            this.bannerDownloadBtn.disabled = true;
            this.bannerDownloadBtn.innerHTML = `
                <div class="loading-spinner" style="width: 18px; height: 18px; margin-right: 8px;"></div>
                Downloading...
            `;
            
            const response = await fetch(bannerUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `discord-banner-${this.currentUserData.id}-1024x1024.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            if (window.ErrorHandler) {
                ErrorHandler.showNotification('Banner downloaded successfully!', 'success');
            }
        } catch (error) {
            console.error('Banner download failed:', error);
            if (window.ErrorHandler) {
                ErrorHandler.showNotification('Failed to download banner. Please try again.', 'error');
            }
        } finally {
            this.bannerDownloadBtn.disabled = false;
            this.bannerDownloadBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Download Banner
            `;
        }
    }
    
    toggleHelp() {
        if (this.helpSection) {
            const isVisible = this.helpSection.style.display !== 'none';
            this.helpSection.style.display = isVisible ? 'none' : 'block';
            
            if (this.helpToggle) {
                this.helpToggle.textContent = isVisible ? 'Need help finding User ID?' : 'Hide help';
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
        if (!this.currentUserData) return;
        
        const format = this.formatSelect?.value || 'png';
        // Always download at highest quality (4096 for custom avatars, 1024 for default)
        const size = this.currentUserData.avatar ? 4096 : 1024;
        const avatarUrl = this.getAvatarUrl(this.currentUserData, size, format);
        
        try {
            this.downloadBtn.disabled = true;
            this.downloadBtn.innerHTML = `
                <div class="loading-spinner" style="width: 18px; height: 18px; margin-right: 8px;"></div>
                Downloading...
            `;
            
            // Create a temporary link to download the image
            const response = await fetch(avatarUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `discord-avatar-${this.currentUserData.id}-${size}x${size}.${format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            // Show success notification
            if (window.ErrorHandler) {
                ErrorHandler.showNotification(`Avatar downloaded in ${size}x${size} ${format.toUpperCase()}!`, 'success');
            }
            
        } catch (error) {
            console.error('Download failed:', error);
            if (window.ErrorHandler) {
                ErrorHandler.showNotification('Failed to download avatar. Please try again.', 'error');
            }
        } finally {
            this.downloadBtn.disabled = false;
            this.downloadBtn.innerHTML = `
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M7 10L12 15M12 15L17 10M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Download Profile Picture
            `;
        }
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
            const response = await fetch(this.currentImageData.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `${this.currentImageData.title}.${this.getImageExtension(this.currentImageData.url)}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            console.log('Downloaded:', this.currentImageData.title);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image. Please try again.');
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
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 16px',
            borderRadius: '8px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateY(-10px)',
            transition: 'all 0.3s ease',
            backgroundColor: type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'
        });

        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        });

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
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
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
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

// Start the application
const app = new App();