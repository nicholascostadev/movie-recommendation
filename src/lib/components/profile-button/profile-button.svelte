<script lang="ts">
	import { goto } from '$app/navigation';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { buttonVariants } from '$lib/components/ui/button';
	import { authClient } from '$lib/auth-client';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuGroup,
		DropdownMenuItem,
		DropdownMenuLabel,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '$lib/components/ui/dropdown-menu';

	const session = authClient.useSession();

	const handleSignOut = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					goto('/login');
				}
			}
		});
	};

	const handleGoToProfile = () => {
		goto(`/u/${$session.data?.user.username ?? $session.data?.user.id}`);
	};
</script>

<DropdownMenu>
	<DropdownMenuTrigger
		class={buttonVariants({ variant: 'ghost', class: 'relative h-8 w-8 rounded-full' })}
	>
		<Avatar class="h-8 w-8">
			{#if $session.data?.user.image}
				<AvatarImage src={$session.data.user.image} alt={$session.data.user.name} />
			{/if}
			<AvatarFallback>
				{$session.data?.user.name?.charAt(0)}
			</AvatarFallback>
		</Avatar>
	</DropdownMenuTrigger>
	<DropdownMenuContent class="w-56" align="end">
		<DropdownMenuLabel class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{$session.data?.user.name}</p>
				<p class="text-xs leading-none text-muted-foreground">{$session.data?.user.email}</p>
			</div>
		</DropdownMenuLabel>
		<DropdownMenuSeparator />
		<DropdownMenuGroup>
			<DropdownMenuItem onSelect={handleGoToProfile}>Profile</DropdownMenuItem>
			<DropdownMenuItem>Settings</DropdownMenuItem>
		</DropdownMenuGroup>
		<DropdownMenuSeparator />
		<DropdownMenuItem onclick={handleSignOut}>Log out</DropdownMenuItem>
	</DropdownMenuContent>
</DropdownMenu>
