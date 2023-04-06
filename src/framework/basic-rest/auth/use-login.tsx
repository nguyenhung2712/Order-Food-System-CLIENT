import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import useWindowSize from '@utils/use-window-size';
import { toast } from 'react-toastify';

export interface LoginInputType {
    username: string;
    password: string;
    remember_me: boolean;
}
async function login(input: LoginInputType) {
    let { remember_me, ...postInput } = input;
    const { data } = await http1.post(`/auth${API_ENDPOINTS.LOGIN}`, { ...postInput });

    return {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
    };
}
export const useLoginMutation = () => {
    const { authorize } = useUI();
    const { width } = useWindowSize();
    const { closeModal } = useModalAction();
    
    return useMutation((input: LoginInputType) => login(input), {
        onSuccess: (data) => {
            toast.success('Đăng nhập thành công.', {
                position: width! > 768 ? 'bottom-right' : 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            Cookies.set('auth_token', data.accessToken);
            Cookies.set('refresh_token', data.accessToken);
            Cookies.set('user', data.user);
            authorize();
            closeModal();
        },
        onError: (data) => {
            toast.error('Đăng nhập thất bại.', {
                position: width! > 768 ? 'bottom-right' : 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
        },
    });
};
