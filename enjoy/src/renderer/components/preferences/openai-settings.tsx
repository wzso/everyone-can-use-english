import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { t } from "i18next";
import {
  Button,
  FormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  toast,
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from "@renderer/components/ui";
import { LLM_PROVIDERS } from "@renderer/components";
import { AISettingsProviderContext } from "@renderer/context";
import { useContext, useState } from "react";

export const OpenaiSettings = () => {
  const { openai, setOpenai } = useContext(AISettingsProviderContext);
  const [editing, setEditing] = useState(false);

  const openAiConfigSchema = z.object({
    key: z.string().optional(),
    model: z.enum(LLM_PROVIDERS.openai.models),
    baseUrl: z.string().optional(),
  });

  const form = useForm<z.infer<typeof openAiConfigSchema>>({
    resolver: zodResolver(openAiConfigSchema),
    values: {
      key: openai?.key,
      model: openai?.model,
      baseUrl: openai?.baseUrl,
    },
  });

  const onSubmit = async (data: z.infer<typeof openAiConfigSchema>) => {
    setOpenai({
      ...data,
    });
    setEditing(false);
    toast.success(t("openaiConfigSaved"));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-start justify-between py-4">
          <div className="">
            <div className="mb-2">Open AI</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormLabel className="min-w-max">{t("key")}:</FormLabel>
                      <Input
                        disabled={!editing}
                        type="password"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormLabel className="min-w-max">{t("model")}:</FormLabel>
                      <Select
                        disabled={!editing}
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectAiModel")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(LLM_PROVIDERS.openai.models || []).map(
                            (option: string) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="baseUrl"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center space-x-2">
                      <FormLabel className="min-w-max">{t("baseUrl")}:</FormLabel>
                      <Input
                        disabled={!editing}
                        placeholder={t("leaveEmptyToUseDefault")}
                        defaultValue=""
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={editing ? "outline" : "secondary"}
              size="sm"
              type="reset"
              onClick={(event) => {
                event.preventDefault();
                form.reset();
                setEditing(!editing);
              }}
            >
              {editing ? t("cancel") : t("edit")}
            </Button>
            <Button className={editing ? "" : "hidden"} size="sm" type="submit">
              {t("save")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
