type Category = { id: string; name: string };

type ArticleDefaults = {
  title: string;
  dek: string;
  content: string;
  categoryId: string;
  author: string;
  location: string;
  tags: string;
  coverImage: string;
  videoUrl: string;
  isBreaking: boolean;
  isFeatured: boolean;
  isVideo: boolean;
  published: boolean;
};

export function ArticleForm({
  categories,
  action,
  defaults,
  submitLabel,
}: {
  categories: Category[];
  action: (formData: FormData) => void;
  defaults?: Partial<ArticleDefaults>;
  submitLabel: string;
}) {
  const d: ArticleDefaults = {
    title: "",
    dek: "",
    content: "",
    categoryId: categories[0]?.id ?? "",
    author: "",
    location: "",
    tags: "",
    coverImage: "",
    videoUrl: "",
    isBreaking: false,
    isFeatured: false,
    isVideo: false,
    published: true,
    ...defaults,
  };

  return (
    <form action={action} className="space-y-6">
      <Field label="Title">
        <input
          name="title"
          required
          defaultValue={d.title}
          className="input"
          placeholder="Headline"
        />
      </Field>

      <Field label="Dek (summary)">
        <textarea
          name="dek"
          required
          rows={2}
          defaultValue={d.dek}
          className="input"
          placeholder="One or two sentence summary shown on cards"
        />
      </Field>

      <Field label="Content" hint="Separate paragraphs with a blank line.">
        <textarea
          name="content"
          required
          rows={12}
          defaultValue={d.content}
          className="input font-mono text-sm"
          placeholder="Write the full story here..."
        />
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Category">
          <select name="categoryId" defaultValue={d.categoryId} className="input">
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Author">
          <input name="author" required defaultValue={d.author} className="input" />
        </Field>
        <Field label="Location" hint="Optional">
          <input name="location" defaultValue={d.location} className="input" />
        </Field>
        <Field label="Tags" hint="Comma separated">
          <input name="tags" defaultValue={d.tags} className="input" />
        </Field>
        <Field label="Cover Image URL" hint="Leave blank to auto-generate">
          <input name="coverImage" defaultValue={d.coverImage} className="input" />
        </Field>
        <Field label="Video Embed URL" hint="Used when 'Video story' is checked">
          <input name="videoUrl" defaultValue={d.videoUrl} className="input" />
        </Field>
      </div>

      <div className="flex flex-wrap gap-6">
        <Checkbox name="isBreaking" label="Breaking" defaultChecked={d.isBreaking} />
        <Checkbox name="isFeatured" label="Featured" defaultChecked={d.isFeatured} />
        <Checkbox name="isVideo" label="Video story" defaultChecked={d.isVideo} />
        <Checkbox name="published" label="Published" defaultChecked={d.published} />
      </div>

      <button
        type="submit"
        className="rounded-full bg-brand px-6 py-3 font-headline text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-ink"
      >
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-ink-muted">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

function Checkbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-ink">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-border accent-brand"
      />
      {label}
    </label>
  );
}
