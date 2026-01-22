"use client";

import { IVoucher } from "@interface/voucher";
import { Select, Text, TextInput, NumberInput, Switch } from "@mantine/core";
import { Create, useForm } from "@refinedev/mantine";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import { formatLocalDateTime } from "@/utils/dateUtils";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const VoucherCreate: React.FC = () => {
  const router = useRouter();
  const { saveButtonProps, getInputProps, values, setFieldValue, errors } =
    useForm({
      initialValues: {
        code: "",
        name: "",
        description: "",
        type: "PERCENTAGE",
        discountValue: 0,
        maxDiscountAmount: 0,
        minOrderAmount: 0,
        validFrom: formatLocalDateTime(new Date()),
        validUntil: formatLocalDateTime(new Date()),
        usageLimit: 1073741824,
        enabled: true,
      },
      refineCoreProps: {
        resource: "voucher",
        onMutationSuccess: (data) => {
          router.push("/voucher");
        },
      },
      validate: {
        code: (value) => (value.length < 1 ? "Kode wajib diisi" : null),
        name: (value) => (value.length < 1 ? "Nama wajib diisi" : null),
        description: (value) =>
          value.length < 10 ? "Deskripsi terlalu pendek" : null,
        discountValue: (value) =>
          value < 0 ? "Diskon harus non-negatif" : null,
        maxDiscountAmount: (value) =>
          value < 0 ? "Maksimum diskon harus non-negatif" : null,
        minOrderAmount: (value) =>
          value < 0 ? "Minimum order harus non-negatif" : null,
        validFrom: (value) => (!value ? "Tanggal mulai wajib diisi" : null),
        validUntil: (value) => (!value ? "Tanggal akhir wajib diisi" : null),
      },
    });

  const handleEditorChange = (value: string) => {
    setFieldValue("description", value);
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "image"],
        ["clean"],
      ],
    },
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <form>
        <TextInput
          mt={8}
          label="Kode"
          placeholder="Masukkan kode"
          {...getInputProps("code")}
        />
        <TextInput
          mt={8}
          label="Nama"
          placeholder="Masukkan nama"
          {...getInputProps("name")}
        />
        <TextInput
          mt={8}
          label="Tipe"
          placeholder="PERCENTAGE"
          disabled
          {...getInputProps("type")}
        />
        <NumberInput
          hideControls
          mt={8}
          label="Nilai Diskon"
          placeholder="Masukkan nilai diskon"
          min={0}
          {...getInputProps("discountValue")}
        />
        <NumberInput
          hideControls
          mt={8}
          label="Maksimum Diskon"
          placeholder="Masukkan maksimum diskon"
          min={0}
          {...getInputProps("maxDiscountAmount")}
        />
        <NumberInput
          hideControls
          mt={8}
          label="Minimum Order"
          placeholder="Masukkan minimum order"
          min={0}
          {...getInputProps("minOrderAmount")}
        />
        <TextInput
          mt={8}
          label="Tanggal Mulai"
          type="datetime-local"
          {...getInputProps("validFrom")}
          value={values.validFrom.slice(0, 16)}
          onChange={(event) =>
            setFieldValue("validFrom", event.target.value + ":00")
          }
        />
        <TextInput
          mt={8}
          label="Tanggal Akhir"
          type="datetime-local"
          {...getInputProps("validUntil")}
          value={values.validUntil.slice(0, 16)}
          onChange={(event) =>
            setFieldValue("validUntil", event.target.value + ":00")
          }
        />
        <NumberInput
          hideControls
          mt={8}
          label="Batas Penggunaan"
          placeholder="Masukkan batas penggunaan"
          min={0}
          {...getInputProps("usageLimit")}
        />
        <Text mt={8} weight={500} size="sm" color="#212529">
          Deskripsi
        </Text>
        <ReactQuill
          theme="snow"
          value={values.description}
          onChange={handleEditorChange}
          style={{ height: "200px", marginBottom: "40px" }}
          modules={modules}
        />
        {errors.description && (
          <Text mt={2} weight={500} size="xs" color="red">
            {errors.description}
          </Text>
        )}
      </form>
    </Create>
  );
};

export default VoucherCreate;
