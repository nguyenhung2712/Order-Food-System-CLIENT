import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import useWindowSize from '@utils/use-window-size';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';

export interface SignUpInputType {
    email: string;
    password: string;
    confPassword: string;
    firstName: string;
    lastName: string;
    remember_me: boolean;
}
async function signUp(input: SignUpInputType) {
    
    let { remember_me, confPassword, ...postInput } = input;
    const { data } = await http1.post(`/auth${API_ENDPOINTS.REGISTER}`, { ...postInput });
    return {
        data: data.payload
    };
}
export const useSignUpMutation = () => {
    const { authorize } = useUI();
    const { width } = useWindowSize();
    const { closeModal, openModal } = useModalAction();
    
    return useMutation((input: SignUpInputType) => signUp(input), {
        onSuccess: (data) => {
            toast.success('Đăng ký thành công. Hãy xác nhận mail để đăng nhập.', {
                    position: width! > 768 ? 'bottom-right' : 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
            /* Cookies.set('auth_token', data.data.accessToken);
            authorize();
            closeModal(); */
        },
        onError: (data) => {
            toast.error('Đăng ký thất bại. Email vừa nhập đã được sử dụng.', {
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
