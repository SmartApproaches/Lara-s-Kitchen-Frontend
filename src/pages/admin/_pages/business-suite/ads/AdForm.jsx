import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, DatePicker, Input, Skeleton, Switch } from "antd";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { HugeiconsIcon } from "@hugeicons/react";
import { Image01Icon } from "@hugeicons/core-free-icons";

import {
  useCreateAdvertMutation,
  useGetAdvertQuery,
  useUpdateAdvertMutation,
} from "../../../../../redux/slices/super-admin/adsApiSlice";
import { PageHeader } from "./AdComponents";
import { ADS_BASE, errorMessage } from "./adUtils";

const TEXT_FIELDS = [
  "title",
  "description",
  "link_url",
  "call_to_action_text",
  "client_name",
  "client_email",
];

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_BYTES = 25 * 1024 * 1024;

const EMPTY_FORM = {
  title: "",
  description: "",
  link_url: "",
  call_to_action_text: "",
  client_name: "",
  client_email: "",
  postNow: true,
  start: null,
  end: null,
};

const isUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const Field = ({ label, required, error, children, hint }) => (
  <div className="block">
    <span className="mb-1.5 block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500"> *</span>}
    </span>
    {children}
    {hint && !error && <span className="mt-1 block text-xs text-gray-400">{hint}</span>}
    {error && <span className="mt-1 block text-xs text-red-500">{error}</span>}
  </div>
);

const AdForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const { data: adRes, isLoading: isLoadingAd, error: loadError } = useGetAdvertQuery(id, {
    skip: !isEdit,
  });
  const [createAdvert, { isLoading: isCreating }] = useCreateAdvertMutation();
  const [updateAdvert, { isLoading: isUpdating }] = useUpdateAdvertMutation();
  const isSaving = isCreating || isUpdating;

  const [form, setForm] = useState(EMPTY_FORM);
  const [initial, setInitial] = useState(EMPTY_FORM);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Load the advert into the form when editing. "Post now" starts off on edit so the
  // existing start date is kept unless changed.
  useEffect(() => {
    const ad = adRes?.data;
    if (!isEdit || !ad) return;
    const loaded = {
      ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, ad[key] ?? ""])),
      postNow: false,
      start: ad.start_date ? dayjs(ad.start_date) : null,
      end: ad.end_date ? dayjs(ad.end_date) : null,
    };
    setForm(loaded);
    setInitial(loaded);
    setPreview(ad.image_url || null);
  }, [adRes, isEdit]);

  // Free the object URL of a picked picture.
  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handlePickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Use a jpg, png, gif or webp picture." }));
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((prev) => ({ ...prev, image: "The picture must be 25 MB or smaller." }));
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const validate = () => {
    const next = {};
    const start = form.postNow ? dayjs() : form.start;

    if (!isEdit && !image) next.image = "Add a picture for the ad.";
    if (!form.title.trim()) next.title = "Give the ad a title.";
    if (!form.link_url.trim()) next.link_url = "Add the link the ad opens.";
    else if (!isUrl(form.link_url.trim()))
      next.link_url = "Use a full URL, starting with https://";
    if (form.client_email.trim() && !isEmail(form.client_email.trim()))
      next.client_email = "Enter a valid email address.";
    if (!form.postNow && !form.start) next.start = "Pick a start date and time.";
    if (!form.end) next.end = "Pick an end date and time.";
    else if (start && !form.end.isAfter(start)) next.end = "The end must be after the start.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const buildBody = () => {
    const body = new FormData();
    const start = form.postNow ? new Date() : form.start.toDate();
    const values = {
      ...Object.fromEntries(TEXT_FIELDS.map((key) => [key, form[key].trim()])),
      start_date: start.toISOString(),
      end_date: form.end.toDate().toISOString(),
      post_now: String(form.postNow),
    };

    if (!isEdit) {
      Object.entries(values).forEach(([key, value]) => {
        if (value != null && value !== "") body.append(key, value);
      });
    } else {
      // PATCH only what changed.
      TEXT_FIELDS.forEach((key) => {
        if (values[key] !== String(initial[key] ?? "").trim()) body.append(key, values[key]);
      });
      const startChanged =
        form.postNow || !initial.start || !form.start.isSame(initial.start, "minute");
      if (startChanged) {
        body.append("start_date", values.start_date);
        body.append("post_now", values.post_now);
      }
      if (!initial.end || !form.end.isSame(initial.end, "minute")) {
        body.append("end_date", values.end_date);
      }
    }

    if (image) body.append("image", image);
    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const body = buildBody();

    if (isEdit && [...body.keys()].length === 0) {
      toast("No changes to save");
      return;
    }

    try {
      if (isEdit) {
        await updateAdvert({ id, body }).unwrap();
        toast.success("Ad updated");
        navigate(`${ADS_BASE}/${id}`);
      } else {
        const res = await createAdvert(body).unwrap();
        toast.success(res?.message || "Ad created");
        navigate(res?.data?.id ? `${ADS_BASE}/${res.data.id}` : ADS_BASE);
      }
    } catch (err) {
      toast.error(errorMessage(err, isEdit ? "Failed to update the ad" : "Failed to create the ad"));
    }
  };

  const title = isEdit ? "Edit ad" : "New ad";

  if (isEdit && isLoadingAd) {
    return (
      <div>
        <PageHeader title={title} />
        <div className="rounded-xl bg-white p-6 shadow-md">
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  if (isEdit && loadError) {
    return (
      <div>
        <PageHeader title={title} backTo={ADS_BASE} />
        <Alert type="error" showIcon message={errorMessage(loadError, "Failed to load the ad")} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={title} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 rounded-xl bg-white p-4 shadow-md sm:p-6 lg:grid-cols-[320px_1fr]"
      >
        {/* Picture */}
        <Field label="Picture" required={!isEdit} error={errors.image} hint="jpg, png, gif or webp, up to 25 MB">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition ${
              errors.image ? "border-red-400" : "border-gray-300 hover:border-[#157F3B]"
            } bg-gray-50`}
          >
            {preview ? (
              <img src={preview} alt="Ad preview" className="h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-2 text-gray-400">
                <HugeiconsIcon icon={Image01Icon} size={36} />
                <span className="text-sm">Choose a picture</span>
              </span>
            )}
          </button>
          {preview && (
            <span className="mt-2 block text-center text-xs text-[#157F3B]">
              Click the picture to replace it
            </span>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handlePickImage}
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <Field label="Title" required error={errors.title}>
              <Input
                size="large"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                status={errors.title && "error"}
                placeholder="Fresh sourdough every morning"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field label="Description">
              <Input.TextArea
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Baked in Hendon, delivered warm."
              />
            </Field>
          </div>

          <Field label="Link" required error={errors.link_url}>
            <Input
              size="large"
              value={form.link_url}
              onChange={(e) => set("link_url", e.target.value)}
              status={errors.link_url && "error"}
              placeholder="https://example.com"
            />
          </Field>

          <Field label="Button text">
            <Input
              size="large"
              value={form.call_to_action_text}
              onChange={(e) => set("call_to_action_text", e.target.value)}
              placeholder="Order now"
            />
          </Field>

          <Field label="Client name">
            <Input
              size="large"
              value={form.client_name}
              onChange={(e) => set("client_name", e.target.value)}
            />
          </Field>

          <Field
            label="Client email"
            error={errors.client_email}
            hint="The client gets emails about this ad, and signs in with this email to see how it's doing."
          >
            <Input
              size="large"
              type="email"
              value={form.client_email}
              onChange={(e) => set("client_email", e.target.value)}
              status={errors.client_email && "error"}
            />
          </Field>

          <div className="flex items-center justify-between rounded-xl bg-[#EFFFF1] p-4 md:col-span-2">
            <div>
              <p className="font-semibold text-[#2A3A25]">Post now</p>
              <p className="text-xs text-gray-500">
                {form.postNow ? "The ad starts as soon as you save." : "Pick when the ad starts."}
              </p>
            </div>
            <Switch
              checked={form.postNow}
              onChange={(checked) => set("postNow", checked)}
              style={{ backgroundColor: form.postNow ? "#1F5226" : undefined }}
            />
          </div>

          <Field label="Start" required={!form.postNow} error={errors.start}>
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="D MMM YYYY, HH:mm"
              size="large"
              className="w-full"
              disabled={form.postNow}
              value={form.postNow ? null : form.start}
              placeholder={form.postNow ? "Now" : "Pick a start"}
              onChange={(value) => set("start", value)}
              status={errors.start && "error"}
            />
          </Field>

          <Field label="End" required error={errors.end}>
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="D MMM YYYY, HH:mm"
              size="large"
              className="w-full"
              value={form.end}
              placeholder="Pick an end"
              onChange={(value) => set("end", value)}
              status={errors.end && "error"}
            />
          </Field>

          <div className="flex justify-end gap-3 pt-2 md:col-span-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={isSaving}
              className="rounded-lg border border-gray-300 px-5 py-2.5 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-[#1F5226] px-6 py-2.5 font-semibold text-white transition hover:bg-[#0d5729] disabled:opacity-60"
            >
              {isSaving ? "Saving…" : isEdit ? "Save changes" : "Create ad"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdForm;
