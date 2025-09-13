import { useMutation, useQueryClient } from "@tanstack/react-query";
import { register } from "../lib/api";

const useRegister = () => {
    const queryClient = useQueryClient();

    const {mutate, isPending, error} = useMutation({
        mutationFn: register,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["authUser"]})
    })

    return {isPending, error, registerMutation: mutate}
}

export default useRegister;