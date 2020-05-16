export const GetApiRootUrl = 'https://localhost:44367';
export const UserLoginRoute = '/Users/Login';
export const UserRegisterRoute = '/Users/Register';
export const AdminLoginRoute = '/Admin/Login';
export const BlogListRoute = '/Blogs';
export const EditDetailsRoute = '/Accounts/EditDetails';
export const UpdatePasswordRoute = '/Accounts/UpdatePassword';


export function IndividualBlogRoute(blogID) {
    return `${BlogListRoute}/${blogID}`;
}

export function BlogEditRoute(blogID) {
    // '/Blogs/1/Edit
    return `${BlogListRoute}/${blogID}/Edit`;
}

export function BlogDeleteRoute(blogID) {
    // '/Blogs/1/Delete'
    return `${BlogListRoute}/${blogID}/Delete`;
}

export function CreateNewBlogRoute() {
    // '/Blogs/CreateNew
    return `${BlogListRoute}/CreateNew`;
}

export function PostListRoute(blogID) {
    // Shows all post under a blog
    // '/Blogs/1/Posts
    return `${BlogListRoute}/${blogID}/Posts`;
}

export function IndividualPostRoute(blogID, postID) {
    // returns '/Blogs/1/Posts/1'
    return `${BlogListRoute}/${blogID}/Posts/${postID}`;
} 

export function PostEditRoute(blogID, postID) {
    // returns '/Blogs/1/Posts/1/Edit'
    return `${BlogListRoute}/${blogID}/Posts/${postID}/Edit`;
}

export function PostDeleteRoute(blogID, postID) {
    // returns '/Blogs/1/Posts/1/Delete'
    return `${BlogListRoute}/${blogID}/Posts/${postID}/Delete`;
}


