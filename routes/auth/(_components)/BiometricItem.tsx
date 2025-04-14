import { Biometric } from "../../../models/auth.ts";

export default function BiometricItem({ biom }: { biom: Biometric }) {
	return (
		<li class="border rounded p-3 bg-gray-50">
			<div class="flex items-center gap-2">
				<svg
					class="w-5 h-5 text-gray-600"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
					/>
				</svg>
				<span class="font-medium">{biom.authenticator}</span>
			</div>
			<p class="text-sm text-gray-600 mt-2">
				Registered: {new Date(biom.created_at).toLocaleString(undefined, {
					dateStyle: "medium",
					timeStyle: "short",
				})}
			</p>
		</li>
	);
}
