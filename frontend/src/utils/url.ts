export const getUserAvatarUrl = (username: string): string => {
    return window.location.origin + process.env.NEXT_PUBLIC_USER_CONTENT_BASE_URL + `avatar/${username}.png`
}