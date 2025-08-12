import { apiSlice } from "../features/api/apiSlice";

 export const fileSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        uploadFile: builder.mutation({
            query: (formData) => ({
                url: "/files/upload",
                method: "POST",
                body: formData
            })
        })
    })
})

export const {useUploadFileMutation} = fileSlice

