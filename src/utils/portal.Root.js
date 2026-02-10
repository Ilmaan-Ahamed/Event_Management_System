// Utiliy to create and mangage portal root for modals

export const createProtalRoot = () => {
    const portalRoot       = document.createElement('div');
    portalRoot.id          = 'modal-portal';
    document.body.appendChild(portalRoot);
    return portalRoot;
};

// Check if portal root exists, create if not
export const getPortalRoot = () => {
    let portalRoot = document.getElementById('modal-portal');
    if (!portalRoot) 
        {
        portalRoot = createProtalRoot();
        }
    return portalRoot;
};