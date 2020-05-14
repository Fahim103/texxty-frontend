export const GetApiRootUrl = 'https://localhost:44367';
export const UserLoginRoute = '/Users/Login';
export const UserRegisterRoute = '/Users/Register';
export const AdminLoginRoute = '/Admin/Login';
export const BlogListRoute = '/Blogs';
export const EditDetailsRoute = '/Accounts/EditDetails';
export const UpdatePasswordRoute = '/Accounts/UpdatePassword';


export function IndividualBlogRoute(blogID){
    return `${BlogListRoute}/${blogID}`;
} 

export function PostListRoute(blogID){
    return `${BlogListRoute}/${blogID}/Posts`;
}

export function IndividualPostRoute(blogID, postID){
    return `${PostListRoute(blogID)}/${postID}`;
} 