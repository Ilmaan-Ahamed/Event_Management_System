// Utility to create and manage portal root for modals

export const createPortalRoot = () => { // Fixed function name
    const portalRoot = document.createElement('div');
    portalRoot.id = 'modal-portal';
    document.body.appendChild(portalRoot);
    return portalRoot;
};

// Check if portal root exists, create if not
export const getPortalRoot = () => {
    let portalRoot = document.getElementById('modal-portal');
    if (!portalRoot) {
        portalRoot = createPortalRoot(); // Fixed function name
    }
    return portalRoot;
};