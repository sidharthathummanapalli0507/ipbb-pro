document.addEventListener('DOMContentLoaded', () => {

    // ── Mobile Nav Toggle ──────────────────────────────────────────────────
    const navToggle = document.getElementById('nav-toggle');
    const navOverlay = document.getElementById('nav-overlay');
    const navbar = document.querySelector('.navbar');

    if (navToggle && navbar) {
        navToggle.addEventListener('click', () => {
            navbar.classList.toggle('nav-menu-open');
            const icon = navToggle.querySelector('i');
            icon.className = navbar.classList.contains('nav-menu-open')
                ? 'fa-solid fa-xmark'
                : 'fa-solid fa-bars';
        });
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', () => {
            navbar.classList.remove('nav-menu-open');
            const icon = navToggle ? navToggle.querySelector('i') : null;
            if (icon) icon.className = 'fa-solid fa-bars';
        });
    }

    // Close mobile nav when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('nav-menu-open');
            const icon = navToggle ? navToggle.querySelector('i') : null;
            if (icon) icon.className = 'fa-solid fa-bars';
        });
    });

    // ── Navbar Scroll Shadow Effect ───────────────────────────────────────
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('navbar--scrolled');
            } else {
                navbar.classList.remove('navbar--scrolled');
            }
        }, { passive: true });
    }

    // ── Scroll Reveal (Intersection Observer) ─────────────────────────────
    const revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(el => observer.observe(el));
    }

    // ── Hero Typewriter Subtitle ──────────────────────────────────────────
    const heroSub = document.querySelector('.hero > .container > p.animate-fade-in');
    if (heroSub) {
        const phrases = [
            'Track your post instantly.',
            'Book in under 2 minutes.',
            'Delivered across 1.5 lakh post offices.',
            'Secure OTP delivery — always.'
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let deleting = false;
        const typeSpeed = 55;
        const deleteSpeed = 30;
        const pauseMs = 2200;

        function typeWriter() {
            const current = phrases[phraseIdx];
            if (deleting) {
                heroSub.textContent = current.substring(0, charIdx--);
                if (charIdx < 0) {
                    deleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                    charIdx = 0;
                    setTimeout(typeWriter, 400);
                    return;
                }
            } else {
                heroSub.textContent = current.substring(0, ++charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(typeWriter, pauseMs);
                    return;
                }
            }
            setTimeout(typeWriter, deleting ? deleteSpeed : typeSpeed);
        }

        // Start after initial fade-in
        setTimeout(typeWriter, 1200);
    }

    // ── DOM Elements - Tracking ────────────────────────────────────────────
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const captchaDisplay = document.getElementById('captcha-code');
    const captchaInput = document.getElementById('captcha-input');
    const refreshCaptcha = document.getElementById('refresh-captcha');
    const trackBtn = document.getElementById('track-btn');
    const errorMsg = document.getElementById('error-msg');
    const trackingResult = document.getElementById('tracking-result');
    const timeline = document.getElementById('timeline');
    const resId = document.getElementById('res-id');
    const resDate = document.getElementById('res-date');

    // DOM Elements - OTP
    const otpActionContainer = document.getElementById('otp-action-container');
    const verifyDeliveryBtn = document.getElementById('verify-delivery-btn');
    const otpModal = document.getElementById('otp-modal');
    const closeModal = document.querySelector('.close-modal');
    const otpDigits = document.querySelectorAll('.otp-digit');
    const submitOtpBtn = document.getElementById('submit-otp-btn');
    const otpMessage = document.getElementById('otp-message');

    // DOM Elements - Booking
    const weightInput = document.getElementById('weight-input');
    const priceValue = document.getElementById('price-value');
    const bookingForm = document.getElementById('booking-form');
    const bookingSuccess = document.getElementById('booking-success');
    const newConsignmentId = document.getElementById('new-consignment-id');

    let currentCaptcha = '';
    const CORRECT_OTP = '1234';

    // Tab Switching Logic
    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');

                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                btn.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');

                // Clear error and reset button state
                if (errorMsg) errorMsg.textContent = '';
                if (trackBtn) trackBtn.classList.remove('active');
            });
        });
    }

    // Enter Key Support for Tracking Inputs
    document.querySelectorAll('.tracking-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (captchaInput.value.length >= 5) {
                    handleTrack();
                } else {
                    captchaInput.focus();
                    if (errorMsg) errorMsg.textContent = 'Please enter the CAPTCHA first.';
                }
            }
        });
    });

    // Captcha Logic
    function generateCaptcha() {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
        }
        currentCaptcha = captcha;
        if (captchaDisplay) captchaDisplay.textContent = captcha;
    }

    if (refreshCaptcha) {
        refreshCaptcha.addEventListener('click', generateCaptcha);
    }

    generateCaptcha(); // Initial generation

    // Enable Search button when captcha is entered
    if (captchaInput) {
        captchaInput.addEventListener('input', () => {
            if (captchaInput.value.length >= 5) {
                trackBtn.classList.add('active');
                trackBtn.disabled = false;
            } else {
                trackBtn.classList.remove('active');
                trackBtn.disabled = true;
            }
        });

        captchaInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && captchaInput.value.length >= 5) {
                handleTrack();
            }
        });
    }

    // Event Listeners
    if (trackBtn) {
        trackBtn.addEventListener('click', handleTrack);
    }

    // Booking Captcha Logic
    const bookingCaptchaDisplay = document.getElementById('booking-captcha-code');
    const bookingCaptchaInput = document.getElementById('booking-captcha-input');
    const bookingRefreshCaptcha = document.getElementById('booking-refresh-captcha');
    let currentBookingCaptcha = '';

    function generateBookingCaptcha() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
        }
        currentBookingCaptcha = captcha;
        if (bookingCaptchaDisplay) bookingCaptchaDisplay.textContent = captcha;
    }

    if (bookingRefreshCaptcha) {
        bookingRefreshCaptcha.addEventListener('click', generateBookingCaptcha);
    }

    generateBookingCaptcha();

    // Validating weight for price
    if (weightInput) {
        weightInput.addEventListener('input', calculatePrice);
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userCaptcha = bookingCaptchaInput.value.trim().toUpperCase();
            if (userCaptcha !== currentBookingCaptcha) {
                showToast('Invalid CAPTCHA. Please try again.', 'error');
                generateBookingCaptcha();
                bookingCaptchaInput.value = '';
                return;
            }
            handleBooking(e);
        });
    }

    if (verifyDeliveryBtn) {
        verifyDeliveryBtn.addEventListener('click', openOtpModal);
    }

    if (closeModal) {
        closeModal.addEventListener('click', closeOtpModal);
    }

    // OTP Input Logic
    if (otpDigits && otpDigits.length > 0) {
        otpDigits.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < otpDigits.length - 1) {
                    otpDigits[index + 1].focus();
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    otpDigits[index - 1].focus();
                }
            });
        });
    }

    if (submitOtpBtn) {
        submitOtpBtn.addEventListener('click', verifyOtp);
    }

    // Contact Captcha Logic
    const contactCaptchaDisplay = document.getElementById('contact-captcha-code');
    const contactCaptchaInput = document.getElementById('contact-captcha-input');
    const contactRefreshCaptcha = document.getElementById('contact-refresh-captcha');
    const contactForm = document.getElementById('contact-form');
    let currentContactCaptcha = '';

    function generateContactCaptcha() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let captcha = '';
        for (let i = 0; i < 5; i++) {
            captcha += chars[Math.floor(Math.random() * chars.length)];
        }
        currentContactCaptcha = captcha;
        if (contactCaptchaDisplay) contactCaptchaDisplay.textContent = captcha;
    }

    if (contactRefreshCaptcha) {
        contactRefreshCaptcha.addEventListener('click', generateContactCaptcha);
    }

    if (contactForm) {
        generateContactCaptcha();
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userCaptcha = contactCaptchaInput.value.trim().toUpperCase();
            if (userCaptcha !== currentContactCaptcha) {
                showToast('Invalid CAPTCHA. Please try again.', 'error');
                generateContactCaptcha();
                contactCaptchaInput.value = '';
                return;
            }
            showToast('Message sent! We\'ll respond within 24 hours.', 'success');
            contactForm.reset();
            generateContactCaptcha();
            // Show success state
            const successPanel = document.getElementById('contact-success');
            if (successPanel) {
                contactForm.classList.add('hidden');
                successPanel.classList.remove('hidden');
            }
        });
    }

    // Functions

    function handleTrack() {
        const activeTab = document.querySelector('.tab-content.active');
        const queryInput = activeTab.querySelector('.tracking-input');
        const query = queryInput.value.trim().toUpperCase();
        const userCaptcha = captchaInput.value.trim();

        // Reset state
        if (errorMsg) errorMsg.textContent = '';
        if (trackingResult) trackingResult.classList.add('hidden');
        if (otpActionContainer) otpActionContainer.classList.add('hidden');

        // Captcha Validation
        if (userCaptcha !== currentCaptcha) {
            if (errorMsg) errorMsg.textContent = 'Invalid CAPTCHA. Please try again.';
            generateCaptcha();
            if (captchaInput) captchaInput.value = '';
            if (trackBtn) trackBtn.classList.remove('active');
            return;
        }

        if (!query) {
            if (errorMsg) errorMsg.textContent = 'Please enter a number to track.';
            return;
        }

        // Logic based on tab
        const activeTabId = activeTab.id;
        if (activeTabId === 'consignment-tab') {
            const consignmentRegex = /^[A-Z0-9]{9,13}$/;
            if (!consignmentRegex.test(query)) {
                if (errorMsg) errorMsg.textContent = 'Please enter a valid Consignment Number (e.g., CP123456789IN).';
                return;
            }
        } else if (activeTabId === 'money-order-tab') {
            if (query.length !== 10 && query.length !== 18) {
                if (errorMsg) errorMsg.textContent = 'Money Order number must be 10 or 18 digits.';
                return;
            }
        }

        // Simulate API Load
        if (trackBtn) {
            const originalText = trackBtn.textContent;
            trackBtn.textContent = 'Searching...';
            trackBtn.disabled = true;

            setTimeout(() => {
                showTrackingResult(query);
                trackBtn.textContent = originalText;
                trackBtn.disabled = false;
                generateCaptcha(); // Refresh for next time
                if (captchaInput) captchaInput.value = '';
            }, 1000);
        }
    }

    function showTrackingResult(input) {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + 2);

        const mockSteps = [
            { date: formatDate(minusDays(today, 2)), status: 'Consignment Booked', location: 'Source Post Office', active: true },
            { date: formatDate(minusDays(today, 1)), status: 'Shipped', location: 'Transit Hub', active: true },
            { date: formatDate(today), status: 'Out for Delivery', location: 'Destination Post Office', active: true },
            { date: 'Expected: ' + formatDate(deliveryDate), status: 'Delivered', location: 'Recipient Address', active: false }
        ];

        if (resId) resId.textContent = input;
        if (resDate) resDate.textContent = formatDate(deliveryDate);

        renderTimeline(mockSteps);

        if (trackingResult) {
            trackingResult.classList.remove('hidden');
            trackingResult.scrollIntoView({ behavior: 'smooth' });
        }

        if (mockSteps[2].active && !mockSteps[3].active) {
            if (otpActionContainer) otpActionContainer.classList.remove('hidden');
        }
    }

    function calculatePrice() {
        const weight = parseFloat(weightInput.value) || 0;
        let price = 0;
        if (weight > 0) {
            price = 40 + (weight * 0.1);
        }
        if (priceValue) priceValue.textContent = `₹${Math.ceil(price)}`;
    }

    function handleBooking(e) {
        e.preventDefault();
        const randomID = 'CP' + Math.floor(Math.random() * 1000000000) + 'IN';
        if (newConsignmentId) newConsignmentId.textContent = randomID;

        // Set ETA (3 business days from today)
        const eta = new Date();
        eta.setDate(eta.getDate() + 3);
        const etaEl = document.getElementById('booking-eta-date');
        if (etaEl) etaEl.textContent = eta.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

        if (bookingSuccess) bookingSuccess.classList.remove('hidden');
        if (bookingForm) {
            bookingForm.parentElement.querySelector('.form-grid')?.classList.add('hidden');
            bookingForm.parentElement.querySelector('.parcel-section')?.classList.add('hidden');
            bookingForm.parentElement.querySelector('.booking-captcha')?.classList.add('hidden');
            bookingForm.parentElement.querySelector('.form-actions')?.classList.add('hidden');
            bookingForm.parentElement.querySelector('.form-divider')?.classList.add('hidden');
        }
        if (bookingSuccess) bookingSuccess.scrollIntoView({ behavior: 'smooth' });

        // Wire print receipt button
        const printBtn = document.getElementById('print-receipt-btn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                const etaText = etaEl ? etaEl.textContent : '—';
                const printWin = window.open('', '_blank', 'width=600,height=500');
                printWin.document.write(`
                    <!DOCTYPE html><html><head>
                    <title>Consignment Receipt – Smart India Post</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
                        h1 { color: #800000; border-bottom: 3px solid #ffd700; padding-bottom: 10px; }
                        .field { margin: 12px 0; }
                        .label { font-size: 0.85rem; color: #888; }
                        .value { font-size: 1.1rem; font-weight: 700; color: #800000; }
                        .badge { display: inline-block; background: #800000; color: #fff; padding: 8px 20px; border-radius: 30px; font-family: monospace; font-size: 1.3rem; letter-spacing: 2px; margin: 10px 0; }
                        .footer { margin-top: 40px; font-size: 0.8rem; color: #aaa; }
                    </style></head><body>
                    <h1>✈ Smart India Post – Booking Receipt</h1>
                    <div class="field"><div class="label">Consignment Number</div><div class="badge">${randomID}</div></div>
                    <div class="field"><div class="label">Booking Date</div><div class="value">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
                    <div class="field"><div class="label">Estimated Delivery</div><div class="value">${etaText}</div></div>
                    <div class="field"><div class="label">Status</div><div class="value">Booked & Processing</div></div>
                    <div class="footer">Smart India Post | 1800-11-2011 | support@indiapost.gov.in | Dak Bhawan, New Delhi</div>
                    </body></html>
                `);
                printWin.document.close();
                printWin.focus();
                setTimeout(() => printWin.print(), 400);
            }, { once: true });
        }
    }


    function renderTimeline(steps) {
        if (!timeline) return;
        timeline.innerHTML = '';
        steps.forEach((step, index) => {
            const isActive = step.active ? 'active' : '';
            const html = `
                <div class="timeline-item ${isActive}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <div class="timeline-date">${step.date}</div>
                        <div class="timeline-status">${step.status}</div>
                        <div class="timeline-location">${step.location}</div>
                    </div>
                </div>
            `;
            timeline.insertAdjacentHTML('beforeend', html);
        });
    }

    function openOtpModal() {
        if (otpModal && otpDigits.length > 0) {
            otpModal.classList.add('active');
            otpDigits[0].focus();
            otpMessage.textContent = '';
            otpMessage.className = 'otp-message';
            resetOtpInputs();
        }
    }

    function closeOtpModal() {
        otpModal.classList.remove('active');
    }

    function verifyOtp() {
        let enteredOtp = '';
        otpDigits.forEach(input => enteredOtp += input.value);

        if (enteredOtp === CORRECT_OTP) {
            otpMessage.textContent = 'Verification Successful! Delivery Confirmed.';
            otpMessage.classList.add('success');

            setTimeout(() => {
                closeOtpModal();
                updateToDelivered();
            }, 1500);
        } else {
            otpMessage.textContent = 'Invalid OTP. Please try again (Use 1234).';
            otpMessage.classList.add('error');
        }
    }

    function updateToDelivered() {
        const items = document.querySelectorAll('.timeline-item');
        if (items.length > 3) {
            items[3].classList.add('active');
            items[3].querySelector('.timeline-status').textContent = 'Successfully Delivered';
            items[3].querySelector('.timeline-date').textContent = formatDate(new Date());
        }

        otpActionContainer.innerHTML = '<h3 style="color: green; text-align: center;"><i class="fa-solid fa-check-circle"></i> Parcel Delivered Successfully</h3>';
    }

    function resetOtpInputs() {
        otpDigits.forEach(input => input.value = '');
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    function minusDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() - days);
        return result;
    }

    // ── Toast Notification ────────────────────────────────────────────────
    function showToast(message, type = 'success') {
        // Remove existing toast
        const existing = document.getElementById('sip-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'sip-toast';
        toast.className = `sip-toast sip-toast--${type}`;
        toast.innerHTML = `
            <i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            <span>${message}</span>
            <button class="toast-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
        `;
        document.body.appendChild(toast);

        // Trigger enter animation
        requestAnimationFrame(() => toast.classList.add('sip-toast--visible'));

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('sip-toast--visible');
            setTimeout(() => toast.remove(), 400);
        });

        // Auto dismiss after 4 seconds
        setTimeout(() => {
            toast.classList.remove('sip-toast--visible');
            setTimeout(() => toast.remove(), 400);
        }, 4000);
    }

    // ── Back-to-Top Button ────────────────────────────────────────────────
    const btt = document.createElement('button');
    btt.id = 'back-to-top';
    btt.className = 'back-to-top';
    btt.setAttribute('aria-label', 'Back to top');
    btt.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    document.body.appendChild(btt);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btt.classList.add('visible');
        } else {
            btt.classList.remove('visible');
        }
    });

    btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ── FAQ Accordion ─────────────────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isOpen = item.classList.contains('open');

            // Close all others
            document.querySelectorAll('.faq-item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                openItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle clicked
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ── Scroll Progress Bar ───────────────────────────────────────────────
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.className = 'scroll-progress';
    document.body.prepend(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    });

    // ── Animated Stat Counters ────────────────────────────────────────────
    function animateCounter(el, target, suffix) {
        const duration = 1800;
        const start = performance.now();
        const startVal = 0;

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(startVal + eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const statData = [
            { selector: '.stat-item:nth-child(1) .stat-num', target: 150000, suffix: '+', display: '1.5L+' },
            { selector: '.stat-item:nth-child(2) .stat-num', target: 40, suffix: 'M+', display: '4Cr+' },
            { selector: '.stat-item:nth-child(3) .stat-num', target: 99, suffix: '.9%', display: '99.9%' },
            { selector: '.stat-item:nth-child(4) .stat-num', target: 195, suffix: '+', display: '195+' },
        ];

        let statsAnimated = false;
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    statsAnimated = true;
                    // Simple number-flip animation using textContent
                    statData.forEach(({ selector, display }) => {
                        const el = document.querySelector(selector);
                        if (!el) return;
                        // Tick-up animation
                        let frame = 0;
                        const totalFrames = 60;
                        const timer = setInterval(() => {
                            frame++;
                            if (frame >= totalFrames) {
                                el.textContent = display;
                                clearInterval(timer);
                            } else {
                                // Scramble effect
                                const chars = '0123456789';
                                el.textContent = Array.from({ length: display.length }, (_, i) => {
                                    if (frame / totalFrames > i / display.length) return display[i];
                                    return /\d/.test(display[i])
                                        ? chars[Math.floor(Math.random() * chars.length)]
                                        : display[i];
                                }).join('');
                            }
                        }, 30);
                    });
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsBar);
    }

    // ── Mobile Floating CTA Button ────────────────────────────────────────
    const isBookingPage = window.location.pathname.includes('booking');
    if (!isBookingPage) {
        const floatBtn = document.createElement('a');
        floatBtn.href = 'booking.html';
        floatBtn.id = 'float-cta';
        floatBtn.className = 'float-cta';
        floatBtn.innerHTML = '<i class="fa-solid fa-box-open"></i><span>Book Now</span>';
        floatBtn.setAttribute('aria-label', 'Book a Post');
        document.body.appendChild(floatBtn);

        // Show only after scrolling past hero
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                floatBtn.classList.add('float-cta--visible');
            } else {
                floatBtn.classList.remove('float-cta--visible');
            }
        });
    }

    // ── Inline Form Validation ────────────────────────────────────────────
    function addInlineValidation(input) {
        input.addEventListener('blur', () => {
            const val = input.value.trim();
            if (input.hasAttribute('required') && !val) {
                input.classList.add('input-error');
            } else {
                input.classList.remove('input-error');
                input.classList.add('input-ok');
            }
        });
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.classList.remove('input-error');
            }
        });
    }

    document.querySelectorAll('.booking-form input[required], .booking-form textarea[required], .refined-contact-form input[required], .refined-contact-form textarea[required]').forEach(addInlineValidation);

    // ── Tracking Input Live Formatting ────────────────────────────────────
    // Auto-uppercase tracking inputs
    document.querySelectorAll('.tracking-input').forEach(input => {
        input.addEventListener('input', () => {
            const pos = input.selectionStart;
            input.value = input.value.toUpperCase();
            input.setSelectionRange(pos, pos);
        });
    });

    // ── Click-to-Copy Consignment Badges ─────────────────────────────────
    function makeCopyable(el) {
        if (!el) return;
        el.addEventListener('click', () => {
            const text = el.textContent.trim();
            navigator.clipboard.writeText(text).then(() => {
                showToast(`Copied: ${text}`, 'success');
            }).catch(() => {
                // Fallback
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                showToast(`Copied: ${text}`, 'success');
            });
        });
    }

    // Wire up both possible badge locations
    makeCopyable(document.getElementById('new-consignment-id'));
    makeCopyable(document.getElementById('res-id'));

    // Also make tracking result ID copyable when it appears
    const resIdEl = document.getElementById('res-id');
    if (resIdEl) makeCopyable(resIdEl);

    // ── Keyboard Accessibility – Tracking Search on Enter ────────────────
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close modal if open
            const modal = document.getElementById('otp-modal');
            if (modal && modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        }
    });

});


