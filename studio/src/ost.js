import { html } from 'lit';
import { EVENT_SELECTED_OFFER } from './constants.js';

let ostRoot;
let target; // rte (editing card) or content-navigation (creating new card)
let currentVariant;
let clickedOffer;
let selectOffer;

const ctaTexts = {
    'buy-now': 'Buy now',
    'free-trial': 'Free trial',
    'start-free-trial': 'Start free trial',
    'get-started': 'Get started',
    'choose-a-plan': 'Choose a plan',
    'learn-more': 'Learn more',
    'change-plan-team-plans': 'Change Plan Team Plans',
    upgrade: 'Upgrade',
    'change-plan-team-payment': 'Change Plan Team Payment',
    'take-the-quiz': 'Take the quiz',
    'see-more': 'See more',
    'upgrade-now': 'Upgrade now',
};

const noPlaceholderCardVariants = ['ccd-action', 'ah'];

export const ostDefaults = {
    aosApiKey: 'wcms-commerce-ims-user-prod',
    checkoutClientId: 'creative',
    country: 'US',
    environment: 'PROD',
    landscape: 'PUBLISHED',
    language: 'en',
    searchParameters: {},
    searchOfferSelectorId: null,
    defaultPlaceholderOptions: {
        displayRecurrence: true,
        displayPerUnit: true,
        displayTax: false,
        displayOldPrice: false,
        forceTaxExclusive: true,
    },
    wcsApiKey: 'wcms-commerce-ims-ro-user-cc',
    ctaTextOption: {
        ctaTexts: Object.entries(ctaTexts).map(([id, name]) => ({ id, name })),
        getDefaultText() {
            return this.ctaTexts[0].id;
        },

        getTexts() {
            return this.ctaTexts;
        },

        getSelectedText(searchParameters) {
            const ctaLabel = searchParameters.get('text');
            return !!ctaLabel &&
                this.ctaTexts.find((label) => label.id === ctaLabel)
                ? ctaLabel
                : this.getDefaultText();
        },
    },
};

export const createMarkup = (offerSelectorId, type, offer, options, promo) => {
    const isCta = !!type?.startsWith('checkout');

    if (isCta) {
        const cta = document.createElement('a', { is: 'checkout-link' });
        cta.setAttribute('data-checkout-workflow', options.workflow);
        cta.setAttribute(
            'data-checkout-workflow-step',
            options.workflowStep ?? 'segmentation',
        );
        cta.setAttribute('data-promotion-code', promo ?? '');
        cta.setAttribute('data-quantity', '1');
        cta.setAttribute('data-wcs-osi', offerSelectorId);

        cta.href = '#';

        const span = document.createElement('span');
        let ctaText = options.ctaText ?? 'buy-now';
        if (noPlaceholderCardVariants.includes(currentVariant)) {
            ctaText = ctaTexts[ctaText];
        }
        span.textContent = ctaText;
        cta.appendChild(span);

        return cta;
    } else {
        const inlinePrice = document.createElement('span', {
            is: 'inline-price',
        });
        inlinePrice.setAttribute(
            'data-display-per-unit',
            options.displayPerUnit ?? 'false',
        );
        inlinePrice.setAttribute(
            'data-quantity',
            offer.ordering.max_quantity ?? '1',
        );
        inlinePrice.setAttribute('data-template', type);
        inlinePrice.setAttribute('data-wcs-osi', offerSelectorId);
        inlinePrice.innerHTML = '&nbsp;';
        return inlinePrice;
    }
};

export function onSelect(offerSelectorId, type, offer, options, promoOverride) {
    const link = createMarkup(
        offerSelectorId,
        type,
        offer,
        options,
        promoOverride,
    );

    console.log(`Use Link: ${link.outerHTML}`);
    if (clickedOffer) {
        clickedOffer.outerHTML = link.outerHTML;
    } else if (selectOffer) {
        target.dispatchEvent(
            new CustomEvent(EVENT_SELECTED_OFFER, {
                detail: { osi: offerSelectorId },
                bubbles: true,
                composed: true,
            }),
        );
        alert(offerSelectorId);
    } else {
        target.appendContent(link.outerHTML);
    }
    closeOstDialog();
}

const getOstEl = () => document.getElementById('ostDialog');

const openOstDialog = () => {
    getOstEl().open = true;
};

const closeOstDialog = () => {
    getOstEl().open = false;
};

export function getOffferSelectorTool() {
    return html`
        <sp-overlay id="ostDialog" type="modal">
            <sp-dialog-wrapper dismissable underlay>
                <div id="ost"></div>
            </sp-dialog-wrapper>
        </overlay-trigger>
    `;
}

// targetEl is either rte (edit context) or content-navigation (create new card context)
export function openOfferSelectorTool(e, targetEl, variant) {
    target = targetEl;
    currentVariant = variant;
    clickedOffer = e.detail?.clickedElement;
    selectOffer = e.detail?.selectOffer;
    let searchOfferSelectorId;
    if (!ostRoot || clickedOffer) {
        ostRoot = document.getElementById('ost');
        const aosAccessToken =
            localStorage.getItem('masAccessToken') ??
            window.adobeid.authorize();
        const searchParameters = new URLSearchParams();
        const defaultPlaceholderOptions = {
            ...ostDefaults.defaultPlaceholderOptions,
        };
        if (clickedOffer) {
            searchOfferSelectorId = clickedOffer.getAttribute('data-wcs-osi');
            Object.assign(defaultPlaceholderOptions, clickedOffer.dataset);
        }
        window.ost.openOfferSelectorTool({
            ...ostDefaults,
            rootElement: ostRoot,
            zIndex: 20,
            aosAccessToken,
            searchParameters,
            searchOfferSelectorId,
            defaultPlaceholderOptions,
            onSelect,
        });
    }
    if (ostRoot) {
        openOstDialog();
    }
}
