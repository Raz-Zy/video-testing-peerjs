"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import { sileo } from "sileo";
import { deleteProductAction } from "@/actions/product.actions";

function EditIcon({ className = "size-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath="url(#clip0_4418_7276)">
        <path
          d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H11C11.41 1.25 11.75 1.59 11.75 2C11.75 2.41 11.41 2.75 11 2.75H9C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V13C21.25 12.59 21.59 12.25 22 12.25C22.41 12.25 22.75 12.59 22.75 13V15C22.75 20.43 20.43 22.75 15 22.75Z"
          fill="currentColor"
        />
        <path
          d="M8.50008 17.6905C7.89008 17.6905 7.33008 17.4705 6.92008 17.0705C6.43008 16.5805 6.22008 15.8705 6.33008 15.1205L6.76008 12.1105C6.84008 11.5305 7.22008 10.7805 7.63008 10.3705L15.5101 2.49055C17.5001 0.500547 19.5201 0.500547 21.5101 2.49055C22.6001 3.58055 23.0901 4.69055 22.9901 5.80055C22.9001 6.70055 22.4201 7.58055 21.5101 8.48055L13.6301 16.3605C13.2201 16.7705 12.4701 17.1505 11.8901 17.2305L8.88008 17.6605C8.75008 17.6905 8.62008 17.6905 8.50008 17.6905ZM16.5701 3.55055L8.69008 11.4305C8.50008 11.6205 8.28008 12.0605 8.24008 12.3205L7.81008 15.3305C7.77008 15.6205 7.83008 15.8605 7.98008 16.0105C8.13008 16.1605 8.37008 16.2205 8.66008 16.1805L11.6701 15.7505C11.9301 15.7105 12.3801 15.4905 12.5601 15.3005L20.4401 7.42055C21.0901 6.77055 21.4301 6.19055 21.4801 5.65055C21.5401 5.00055 21.2001 4.31055 20.4401 3.54055C18.8401 1.94055 17.7401 2.39055 16.5701 3.55055Z"
          fill="currentColor"
        />
        <path
          d="M19.8501 9.83027C19.7801 9.83027 19.7101 9.82027 19.6501 9.80027C17.0201 9.06027 14.9301 6.97027 14.1901 4.34027C14.0801 3.94027 14.3101 3.53027 14.7101 3.41027C15.1101 3.30027 15.5201 3.53027 15.6301 3.93027C16.2301 6.06027 17.9201 7.75027 20.0501 8.35027C20.4501 8.46027 20.6801 8.88027 20.5701 9.28027C20.4801 9.62027 20.1801 9.83027 19.8501 9.83027Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_4418_7276">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function TrashIcon({ className = "size-5" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <g clipPath="url(#clip0_4418_9808)">
        <path
          d="M21 5.98047C17.67 5.65047 14.32 5.48047 10.98 5.48047C9 5.48047 7.02 5.58047 5.04 5.78047L3 5.98047"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M18.85 9.14062L18.2 19.2106C18.09 20.7806 18 22.0006 15.21 22.0006H8.79002C6.00002 22.0006 5.91002 20.7806 5.80002 19.2106L5.15002 9.14062"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.33 16.5H13.66"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 12.5H14.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4418_9808">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function ManageProductActions({ product, onEditProduct, onProductDeleted }) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openEdit = () => {
    if (typeof onEditProduct === "function") {
      onEditProduct(product);
    }
  };

  const remove = async () => {
    const id = product.productId ?? product.id;
    const result = await deleteProductAction(id);
    setConfirmOpen(false);
    if (result?.status === "200 OK") {
      sileo.success({
        description: (
          <span className="block">
            <span className="text-[15px] font-semibold leading-snug text-white">
              Product <span className="text-red-400">Delete</span>
            </span>
            <span className="mt-1.5 block text-sm font-normal text-white/75">
              {result?.message ?? "Removed from the catalog."}
            </span>
          </span>
        ),
      });
      if (typeof onProductDeleted === "function") {
        onProductDeleted(id);
      }
      router.refresh();
    } else {
      sileo.error({
        title: "Delete failed",
        description:
          typeof result?.message === "string"
            ? result.message
            : "Could not delete this product.",
      });
    }
  };

  return (
    <>
      <Dropdown placement="bottom end">
        <DropdownTrigger>
          <Button
            isIconOnly
            variant="light"
            aria-label="Product options"
            className="size-9 min-w-9 rounded-2xl border border-gray-200 bg-white/90 text-gray-700 shadow-sm"
          >
            <span aria-hidden className="text-lg leading-none">
              ⋯
            </span>
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label="Product options"
          onAction={(key) => {
            if (key === "edit") openEdit();
            if (key === "delete") setConfirmOpen(true);
          }}
        >
          <DropdownItem key="edit" textValue="Edit" startContent={<EditIcon />}>
            Edit
          </DropdownItem>
          <DropdownItem
            key="delete"
            textValue="Delete"
            color="danger"
            variant="flat"
            startContent={<TrashIcon />}
          >
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={confirmOpen} onOpenChange={setConfirmOpen} placement="center" size="sm">
        <ModalContent>
          <ModalHeader>Delete product?</ModalHeader>
          <ModalBody>
            <p className="text-sm text-gray-600">
              This will remove{" "}
              <span className="font-semibold">
                {product.productName ?? product.name ?? "this product"}
              </span>
              .
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button color="danger" variant="flat" onPress={remove}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
