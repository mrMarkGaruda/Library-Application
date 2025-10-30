import { useEffect, useState, type FormEvent } from "react"
import { countries } from "../../mockData/countries"
import type { Author } from "../../types/Author"

interface AddAuthorFormProps {
	onSubmit: (author: Author) => Promise<void> | void
	onCancel?: () => void
	onSuccess?: () => void
	initialValues?: Author
	mode?: "create" | "edit"
}

const AddAuthorForm = ({
	onSubmit,
	onCancel,
	onSuccess,
	initialValues,
	mode = "create",
}: AddAuthorFormProps) => {
	const [formData, setFormData] = useState<Author>(
		initialValues ?? {
			name: "",
			bio: "",
			birthYear: new Date().getFullYear(),
			country: "",
		}
	)

	const [errors, setErrors] = useState<Partial<Record<keyof Author, string>>>(
		{}
	)
	const [submissionError, setSubmissionError] = useState<string | null>(null)

	useEffect(() => {
		if (initialValues) {
			setFormData(initialValues)
		}
	}, [initialValues])

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({
			...prev,
			[name]: name === "birthYear" ? parseInt(value) || 0 : value,
		}))
		// Clear error when user starts typing
		if (errors[name as keyof Author]) {
			setErrors((prev) => ({ ...prev, [name]: "" }))
		}
	}

	const validate = (): boolean => {
		const newErrors: Partial<Record<keyof Author, string>> = {}

		if (!formData.name.trim()) {
			newErrors.name = "Name is required"
		}

		if (!formData.bio.trim()) {
			newErrors.bio = "Bio is required"
		}

		if (!formData.country.trim()) {
			newErrors.country = "Country is required"
		}

		if (
			!formData.birthYear ||
			formData.birthYear < 1000 ||
			formData.birthYear > new Date().getFullYear()
		) {
			newErrors.birthYear = "Please enter a valid birth year"
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		if (!validate()) {
			return
		}

		try {
			await Promise.resolve(onSubmit(formData))
			setSubmissionError(null)
			if (mode === "create") {
				setFormData({
					name: "",
					bio: "",
					birthYear: new Date().getFullYear(),
					country: "",
				})
			}
			setErrors({})
			onSuccess?.()
		} catch (error) {
			console.error("Failed to submit author:", error)
			setSubmissionError(
				error instanceof Error
					? error.message
					: "Unable to save author. Please try again."
			)
		}
	}

	const heading = mode === "edit" ? "Edit Author" : "Add New Author"
	const submitLabel = mode === "edit" ? "Save Changes" : "Add Author"

	return (
		<section className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-soft">
			<header className="mb-8 space-y-2">
				<p className="text-xs font-semibold uppercase tracking-[0.35em] text-soft-gray">
					Author profile
				</p>
				<h2 className="text-3xl font-semibold text-rich-black">{heading}</h2>
				<p className="text-sm text-soft-gray">
					Share a few details to help the library tell this author&#39;s story.
				</p>
			</header>

			{submissionError && (
				<div className="mb-6 rounded-xl border border-error-soft bg-error-soft px-4 py-3 text-sm text-error">
					{submissionError}
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Name Input */}
				<div>
					<label htmlFor="name" className="input-label">
						Name *
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={formData.name}
						onChange={handleChange}
						className="form-field"
						aria-invalid={errors.name ? "true" : "false"}
						placeholder="Enter author's full name"
					/>
					{errors.name && (
						<p className="mt-2 text-xs font-medium text-error">{errors.name}</p>
					)}
				</div>

				{/* Bio Input */}
				<div>
					<label htmlFor="bio" className="input-label">
						Biography *
					</label>
					<textarea
						id="bio"
						name="bio"
						value={formData.bio}
						onChange={handleChange}
						rows={4}
						className="form-field resize-none"
						aria-invalid={errors.bio ? "true" : "false"}
						placeholder="Enter a brief biography"
					/>
					{errors.bio && (
						<p className="mt-2 text-xs font-medium text-error">{errors.bio}</p>
					)}
				</div>

				{/* Birth Year and Country in a grid */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					{/* Birth Year Input */}
					<div>
						<label htmlFor="birthYear" className="input-label">
							Birth Year *
						</label>
						<input
							type="number"
							id="birthYear"
							name="birthYear"
							value={formData.birthYear}
							onChange={handleChange}
							min="1000"
							max={new Date().getFullYear()}
							className="form-field"
							aria-invalid={errors.birthYear ? "true" : "false"}
							placeholder="e.g., 1950"
						/>
						{errors.birthYear && (
							<p className="mt-2 text-xs font-medium text-error">{errors.birthYear}</p>
						)}
					</div>

					{/* Country Input */}
					<div>
						<label htmlFor="country" className="input-label">
							Country *
						</label>
						<select
							id="country"
							name="country"
							value={formData.country}
							onChange={handleChange}
							className="form-field"
							aria-invalid={errors.country ? "true" : "false"}
						>
							<option value="">Select a country</option>
							{countries.map((country) => (
								<option key={country} value={country}>
									{country}
								</option>
							))}
						</select>
						{errors.country && (
							<p className="mt-2 text-xs font-medium text-error">{errors.country}</p>
						)}
					</div>
				</div>

				{/* Form Actions */}
				<div className="flex flex-col gap-3 pt-6 sm:flex-row">
					<button
						type="submit"
						className="btn-primary flex-1"
					>
						{submitLabel}
					</button>
					{onCancel && (
						<button
							type="button"
							onClick={onCancel}
							className="btn-secondary flex-1"
						>
							Cancel
						</button>
					)}
				</div>
			</form>
		</section>
	)
}

export default AddAuthorForm
