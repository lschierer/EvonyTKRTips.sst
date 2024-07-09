use strict;
use warnings;
use ExtUtils::MakeMaker;

WriteMakefile(
  VERSION   => '0.01',
  PREREQ_PM => {
    'Mojolicious'                       => '9.37',
    'Mojolicious::Plugin::Status'       => '1.17',
    'CPAN::DistnameInfo'                => 'any',
    'Cpanel::JSON::XS'                  => 'any',
    'Dist::Zilla'                       => 'any',
    'Dist::Zilla::Plugin::Git'          => 'any',
    'Dist::Zilla::PluginBundle::Git'    => 'any',
    'HTML::Scrubber'                    => 'any',
    'JSON'                              => 'any',
    'JSON::MaybeXS'                     => 'any',
    'JSON::PP'                          => 'any',
    'PadWalker'                         => 'any',
    'Plack'                             => 'any',
    'Pod::Elemental::Transformer'       => 'any',
    'Pod::Elemental::Transformer::List' => 'any',
    'Pod::Weaver'                       => 'any'
  },
  test_requires => {
    'Test::Inter'             => 'any',
    'Test::Memory::Cycle'     => 'any',
    'Test::NoWarnings'        => 'any',
    'Test::Pod'               => 'any',
    'Test::Pod::Coverage'     => 'any',
    'Test2::Tools::Process'   => 'any',
    'Devel::Cycle'            => 'any'
  },
  test => {TESTS => 't/*.t'}
);
